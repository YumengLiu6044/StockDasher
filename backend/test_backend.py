import unittest
import requests

BACKEND_URL = "http://127.0.0.1:8000"

class MyTestCase(unittest.TestCase):
    def test_root(self):
        response = requests.get(BACKEND_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"Hello": "World"})

    def test_search_symbol(self):
        response = requests.post(BACKEND_URL + "/searchSymbol", json={"query": "AAPL"})
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json()), 1)

    def test_get_stock_logo(self):
        response = requests.post(BACKEND_URL + "/getStockLogo", json={"symbol": "AAPL"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("logo", response.json())

    def test_get_stock_price(self):
        response = requests.post(BACKEND_URL + "/getStockPrice", json={"symbol": "AAPL", "function": "TIME_SERIES_DAILY"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("Meta Data", response.json())

if __name__ == '__main__':
    unittest.main()
