function KAPI_Public(endpoint, parameters) {
  http_response = UrlFetchApp.fetch('https://api.kraken.com/0/public/' + endpoint + '?' + parameters)
  api_data = http_response.getContentText()
  return api_data
}

function KAPI_Ticker(currency_pairs) {
  api_data = JSON.parse(KAPI_Public("Ticker", "pair=" + currency_pairs))
  api_results = new Array
  for ( name in api_data['result'] ) {
    api_results.push([ name, api_data['result'][name]['a'][0], api_data['result'][name]['a'][2], api_data['result'][name]['b'][0], api_data['result'][name]['b'][2], api_data['result'][name]['c'][0], api_data['result'][name]['c'][1] ])
  }
  return api_results
}

function KAPI_Depth(currency_pair, depth) {
  api_data = JSON.parse(KAPI_Public("Depth", "pair=" + currency_pair + "&count=" + depth))
  api_results = new Array
  for ( count = 0; count < parseInt(depth); count++ ) {
    api_results.push([ api_data['result'][currency_pair]['bids'][count][0], api_data['result'][currency_pair]['bids'][count][1], api_data['result'][currency_pair]['asks'][count][0], api_data['result'][currency_pair]['asks'][count][1] ])
  }
  return api_results
}
