angular.module('app', ['mx.json.edit', 'watchers']);

angular.module('app').controller('Demo', function ($scope, $filter, $timeout) {

  $scope.jsonData = {"chain": [{"order.order_type": {"purchase": {"card.sender_bank_id": {"1": {"order.additional_data.last_response_code": {"[9036,9076,9082,9001]": {"order.entry_mode": {"!s2srecurring": {"@3ds": true, "@js_wait_on_3ds_decline": true, "terminal.protocol": "ecompb", "@js_wait_on_3ds_decline_duration": 15, "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "UAH", "terminal.type": "purchase"}}}}}}}, "p2p credit": {"card.receiver_brand": {"VISA": {"terminal.terminal_id": "I0110R92"}, "[MAESTRO,MASTERCARD]": {"terminal.terminal_id": "I0110R91"}}}}}, {"order.order_type": {"purchase": {"card.sender_bank_id": {"1": {"order.additional_data.last_response_code": {"[9036,9076,9082,9001]": {"order.entry_mode": {"!s2srecurring": {"@3ds": true, "@js_wait_on_3ds_decline_duration": 15, "@js_wait_on_3ds_decline": true, "terminal.id": 4211}}}}}}}}}], "first": [{"order.entry_mode": {"[redirect,s2s3ds,p2pcredit]": {"order.order_type": {"p2p credit": {"terminal.id": 1673}, "[purchase,verification]": {"order.currency": {"merchant_accounts.currency": {"order.additional_data.card_type": {"[MAESTRO,MASTERCARD]": {"terminal.card_type": "MASTERCARD", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "order.currency", "terminal.type": "purchase"}, "else": {"terminal.card_type": "VISA", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "order.currency", "terminal.type": "purchase"}}}, "else": {"order.additional_data.card_type": {"[MAESTRO,MASTERCARD]": {"terminal.card_type": "MASTERCARD", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "UAH", "terminal.type": "purchase"}, "else": {"terminal.card_type": "VISA", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "UAH", "terminal.type": "purchase"}}}}}, "else": {"order.currency": {"merchant_accounts.currency": {"order.additional_data.card_type": {"[MAESTRO,MASTERCARD]": {"terminal.card_type": "MASTERCARD", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "order.currency", "terminal.type": "order.order_type"}, "else": {"terminal.card_type": "VISA", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "order.currency", "terminal.type": "order.order_type"}}}, "else": {"order.additional_data.card_type": {"[MAESTRO,MASTERCARD]": {"terminal.card_type": "MASTERCARD", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "UAH", "terminal.type": "order.order_type"}, "else": {"terminal.card_type": "VISA", "terminal.payment_system_id": 4, "terminal.mcc": "merchant.mcc", "terminal.region_id": "merchant.region_id", "terminal.currency": "UAH", "terminal.type": "order.order_type"}}}}}}}, "s2srecurring": {"terminal.id": "order.additional_data.rectoken_terminal_id"}}}]};

  $scope.$watch('jsonData', function(json) {
    $scope.jsonString = $filter('json')(json);
  }, true);

  $scope.$watch('jsonString', function(json) {
    try {
      $scope.jsonData = JSON.parse(json);
      $scope.wellFormed = true;
    } catch(e) {
      $scope.wellFormed = false;
    }
  }, true);

  $scope.setData = function(){
    $scope.jsonData = {};

    $timeout(function(){
      $scope.jsonString = $filter('json')({"test": "123"});
    })
  }
});


