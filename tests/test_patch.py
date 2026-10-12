import unittest
from launch import enhance_page


class PagePatchTests(unittest.TestCase):
    def test_hook_uses_known_input_layout_once(self):
        original = '<head></head><script>Atomics.store(w, MY, H >> 1);</script>'
        result = enhance_page(original)
        self.assertEqual(result.count('PlayGTA5Extras.install'), 1)
        self.assertIn('/__enhanced/controller.js', result)
        self.assertNotIn('PlayGTA5Extras', original)

    def test_unknown_layout_fails_instead_of_guessing(self):
        with self.assertRaises(ValueError): enhance_page('<head>new engine</head>')


if __name__ == '__main__': unittest.main()
