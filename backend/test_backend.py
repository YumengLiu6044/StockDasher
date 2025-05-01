import unittest
import requests
from pprint import pprint

BACKEND_URL = "http://0.0.0.0:10000"

class MyTestCase(unittest.TestCase):
    def test_root(self):
        response = requests.get(BACKEND_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"Hello": "World"})

    def test_search_symbol(self):
        response = requests.post(BACKEND_URL + "/searchSymbol", json={"query": "AAPL"})
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json()), 1)

    def test_get_stock_price(self):
        response = requests.post(
            BACKEND_URL + "/getStockPrice",
            json={"symbol": "AAPL", "timeframe": "1D", "begin_time": "2021-01-01", "end_time": "2021-01-08"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.json())

    def test_get_company_quote(self):
        response = requests.post(BACKEND_URL + "/getCompanyQuote", json={"symbol": "AAPL"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("pc", response.json())

    def test_get_top_earners(self):
        response = requests.get(BACKEND_URL + "/getTopEearners")
        self.assertEqual(response.status_code, 200)
        self.assertIn("top_gainers", response.json())

    def test_company_profile(self):
        response = requests.post(BACKEND_URL + "/getCompanyProfile", json={"query": "AAPL"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("logo", response.json())

if __name__ == '__main__':
    unittest.main()
