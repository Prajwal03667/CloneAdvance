"""Run the experimental launcher against an existing, verified PlayGTA5 installation."""
import argparse
import importlib.util
import io
from pathlib import Path
import sys
import webbrowser
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
ASSETS = {'index.html', 'launcher.js', 'extras.js', 'controller.js', 'cheats.json', 'style.css'}


def enhance_page(code):
    marker = 'Atomics.store(w, MY, H >> 1);'
    if code.count(marker) != 1 or code.count('<head>') != 1:
        raise ValueError('Unsupported game page. Use the full-game-v1 snapshot; no files were modified.')
    code = code.replace('<head>', '<head><script src="/__enhanced/controller.js"></script><script src="/__enhanced/extras.js"></script>', 1)
    return code.replace(marker, marker + '\nwindow.PlayGTA5Extras.install({keys, w, U16, VK, canvas});', 1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--install', type=Path, help='Folder containing serve_local.py and mirror/')
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--engine-ram', type=int, choices=[3, 4], default=3,
                        help='Initial engine allocation in GiB; 4 is experimental, not an FPS fix')
    parser.add_argument('--no-open', action='store_true')
    args = parser.parse_args()
    install = (args.install or Path(input('Existing PlayGTA5 installation folder: ').strip().strip('"'))).resolve()
    if not (install / 'serve_local.py').is_file() or not (install / 'mirror/playgta5.com/index.html').is_file():
        parser.error('Finish installing the main repo first; choose the folder containing serve_local.py and mirror.')
    sys.path.insert(0, str(install))
    spec = importlib.util.spec_from_file_location('serve_local', install / 'serve_local.py')
    server = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(server)
    original_patch = server.improve_game_page
    server.improve_game_page = lambda code: enhance_page(original_patch(code))
    # Validate before opening a socket. Verified source files are never rewritten.
    server.improve_game_page((server.ROOT / 'index.html').read_text(encoding='utf-8'))

    class EnhancedHandler(server.Handler):
        def send_head(self):
            path = urlsplit(self.path).path
            if path == '/__enhanced/': path += 'index.html'
            if path.startswith('/__enhanced/'):
                name = path[len('/__enhanced/'):]
                if name not in ASSETS:
                    self.send_error(404)
                    return None
                body = (HERE / 'web' / name).read_bytes()
                content_type = self.guess_type(name)
            elif args.engine_ram == 4 and path.startswith('/b/') and path.endswith('/game.js'):
                source = Path(self.translate_path(self.path))
                if not source.is_file():
                    self.send_error(404)
                    return None
                code = source.read_text(encoding='utf-8')
                marker = 'var INITIAL_MEMORY=3221225472;'
                if code.count(marker) != 1:
                    self.send_error(409, 'Unsupported engine memory layout')
                    return None
                body = code.replace(marker, 'var INITIAL_MEMORY=4294967296;', 1).encode('utf-8')
                content_type = 'text/javascript'
            else:
                return super().send_head()
            self.byte_range = None
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            return io.BytesIO(body)

    address = f'http://localhost:{args.port}/__enhanced/'
    with server.ThreadingHTTPServer(('127.0.0.1', args.port), EnhancedHandler) as httpd:
        print(f'Enhanced launcher: {address}\nEngine starts with {args.engine_ram} GiB. Ctrl+C stops the server.', flush=True)
        if not args.no_open: webbrowser.open(address)
        try: httpd.serve_forever()
        except KeyboardInterrupt: pass


if __name__ == '__main__':
    main()
