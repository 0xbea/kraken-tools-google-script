API_Public_Key = { 'Account':'<<your public key here>>' }
API_Private_Key = { 'Account':'<<your private key here>>' }

function KAPI_Private(acc_id, endpoint, parameters) {
  Utilities.sleep(Math.random() * 100)
  
  api_key = API_Public_Key[acc_id]
  api_secret = Utilities.base64Decode(API_Private_Key[acc_id])
  api_path = Utilities.newBlob('/0/private/' + endpoint).getBytes()
  api_nonce = Date.now().toString()
  api_post = 'nonce=' + api_nonce + '&' + parameters
  
  api_sha256 = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, api_nonce + api_post)
  api_hmac = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, api_path.concat(api_sha256), api_secret)
  api_signature = Utilities.base64Encode(api_hmac)
  
  http_options = {'method':'post', 'payload':api_post, 'headers':{'API-Key':api_key, 'API-Sign':api_signature}}
  http_response = UrlFetchApp.fetch('https://api.kraken.com/0/private/' + endpoint, http_options)
  api_data = http_response.getContentText()
  return api_data
}

function KAPI_Balance(acc_id) {
  acc_balances_json = JSON.parse(KAPI_Private(acc_id, 'BalanceEx', ''))
  acc_balances = new Array
  for ( name in acc_balances_json['result'] ) {
    acc_balances.push([name, parseFloat(acc_balances_json['result'][name]['balance'])])
  }
    return acc_balances
}

function KAPI_OpenOrders(acc_id) {
  acc_orders_json = JSON.parse(KAPI_Private(acc_id, 'OpenOrders', ''))
  acc_orders = new Array
  for ( name in acc_orders_json['result']['open'] ) {
    acc_orders.push([name, acc_orders_json['result']['open'][name]['descr']['pair'], acc_orders_json['result']['open'][name]['descr']['type'], parseFloat(acc_orders_json['result']['open'][name]['descr']['price']), parseFloat(acc_orders_json['result']['open'][name]['vol']), parseFloat(acc_orders_json['result']['open'][name]['vol_exec']), parseFloat(acc_orders_json['result']['open'][name]['opentm'])])
  }
    return acc_orders
}

function KAPI_AddOrder(acc_id, pair, type, ordertype, volume, price) {
  parameters = ''
  parameters += 'pair=' + pair
  parameters += '&type=' + type
  parameters += '&ordertype=' + ordertype
  parameters += '&volume=' + volume
  parameters += '&price=' + price
  acc_addorder_json = JSON.parse(KAPI_Private(acc_id, 'AddOrder', parameters))
}
