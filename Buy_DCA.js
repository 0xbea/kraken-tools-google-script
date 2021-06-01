function buyDCA(pair,amount) {
  KAPI_Ticker(pair)
  for (name in api_data['result']) {
    bid = api_data['result'][name]['b'][0]
  }
  price = bid
  volume = amount / bid
  KAPI_AddOrder('Account', pair, 'buy', 'limit', volume, price)
}
