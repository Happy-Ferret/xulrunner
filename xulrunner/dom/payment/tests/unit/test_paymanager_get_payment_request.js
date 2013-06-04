/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

function getPaymentHelper() {
  let error;
  let paym = newPaymentModule();

  paym.PaymentManager.paymentFailed = function paymentFailed(aRequestId,
                                                             errorMsg) {
    error = errorMsg;
  };

  return {
    get paymentModule() {
      return paym;
    },
    get error() {
      return error;
    }
  };
}

function run_test() {
  run_next_test();
}

function testGetPaymentRequest(paymentProviders, test) {
  let helper = getPaymentHelper();
  let paym = helper.paymentModule;

  paym.PaymentManager.registeredProviders = paymentProviders;

  let ret = paym.PaymentManager.getPaymentRequestInfo("", test.jwt);
  if (!test.result) {
    test.ret ? do_check_true(ret) : do_check_false(ret);
  }
  if (test.error !== null) {
    do_check_eq(helper.error, test.error);
  } else {
    do_check_eq(typeof ret, "object");
    do_check_eq(ret.jwt, test.jwt);
    do_check_eq(ret.type, test.result.type);
    do_check_eq(ret.providerName, test.result.providerName);
  }
}

add_test(function test_successfull_request() {
  let providers = {};
  let type = "mock/payments/inapp/v1";
  providers[type] = {
    name: "mockprovider",
    description: "Mock Payment Provider",
    uri: "https://mockpayprovider.phpfogapp.com/?req=",
    requestMethod: "GET"
  };

  // Payload
  //  {
  //    "aud": "mockpayprovider.phpfogapp.com",
  //    "iss": "Enter you app key here!",
  //    "request": {
  //      "name": "Piece of Cake",
  //      "price": "10.50",
  //      "priceTier": 1,
  //      "productdata": "transaction_id=86",
  //      "currencyCode": "USD",
  //      "description": "Virtual chocolate cake to fill your virtual tummy"
  //    },
  //    "exp": 1352232792,
  //    "iat": 1352229192,
  //    "typ": "mock/payments/inapp/v1"
  //  }
  let jwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJhdWQiOiAibW9j" +
            "a3BheXByb3ZpZGVyLnBocGZvZ2FwcC5jb20iLCAiaXNzIjogIkVudGVyI" +
            "HlvdSBhcHAga2V5IGhlcmUhIiwgInJlcXVlc3QiOiB7Im5hbWUiOiAiUG" +
            "llY2Ugb2YgQ2FrZSIsICJwcmljZSI6ICIxMC41MCIsICJwcmljZVRpZXI" +
            "iOiAxLCAicHJvZHVjdGRhdGEiOiAidHJhbnNhY3Rpb25faWQ9ODYiLCAi" +
            "Y3VycmVuY3lDb2RlIjogIlVTRCIsICJkZXNjcmlwdGlvbiI6ICJWaXJ0d" +
            "WFsIGNob2NvbGF0ZSBjYWtlIHRvIGZpbGwgeW91ciB2aXJ0dWFsIHR1bW" +
            "15In0sICJleHAiOiAxMzUyMjMyNzkyLCAiaWF0IjogMTM1MjIyOTE5Miw" +
            "gInR5cCI6ICJtb2NrL3BheW1lbnRzL2luYXBwL3YxIn0.QZxc62USCy4U" +
            "IyKIC1TKelVhNklvk-Ou1l_daKntaFI";

  testGetPaymentRequest(providers, {
    jwt: jwt,
    ret: true,
    error: null,
    result: {
      type: type,
      providerName: providers[type].name
    }
  });

  run_next_test();
});

add_test(function test_successfull_request_html_description() {
  let providers = {};
  let type = "mozilla/payments/pay/v1";
  providers[type] = {
    name: "webpay",
    description: "Mozilla Payment Provider",
    uri: "https://marketplace.firefox.com/mozpay/?req=",
    requestMethod: "GET"
  };

  // Payload
  //  {
  //    "aud": "marketplace.firefox.com",
  //    "iss": "marketplace-dev.allizom.org",
  //    "request": {
  //      "name": "Krupa's paid app 1",
  //      "chargebackURL": "http://localhost:8002/telefonica/services/webpay/"
  //                       "chargeback",
  //      "postbackURL": "http://localhost:8002/telefonica/services/webpay/"
  //                     "postback",
  //      "productData": "addon_id=85&seller_uuid=d4855df9-6ce0-45cd-81cb-"
  //                     "cf8737e1e7aa&contrib_uuid=201868b7ac2cda410a99b3"
  //                     "ed4c11a8ea",
  //      "pricePoint": 1,
  //      "id": "maude:85",
  //      "description": "This app has been automatically generated by <a href="
  //                     "\"http://outgoing.mozilla.org/v1/ba7f373ae16789eff3ab"
  //                     "fd95ca8d3c15d18dc9009afa204dc43f85a55b1f6ef1/http%3A/"
  //                     "/testmanifest.com\" rel=\"nofollow\">testmanifest.com"
  //                     "</a>"
  //    },
  //    "exp": 1358379147,
  //    "iat": 1358375547,
  //    "typ": "mozilla/payments/pay/v1"
  //  }
  let jwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJhdWQiOiAibWFya2V0cGx" +
            "hY2UuZmlyZWZveC5jb20iLCAiaXNzIjogIm1hcmtldHBsYWNlLWRldi5hbGxpem9" +
            "tLm9yZyIsICJyZXF1ZXN0IjogeyJuYW1lIjogIktydXBhJ3MgcGFpZCBhcHAgMSI" +
            "sICJjaGFyZ2ViYWNrVVJMIjogImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMi90ZWxlZm9" +
            "uaWNhL3NlcnZpY2VzL3dlYnBheS9jaGFyZ2ViYWNrIiwgInBvc3RiYWNrVVJMIjo" +
            "gImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMi90ZWxlZm9uaWNhL3NlcnZpY2VzL3dlYnB" +
            "heS9wb3N0YmFjayIsICJwcm9kdWN0RGF0YSI6ICJhZGRvbl9pZD04NSZzZWxsZXJ" +
            "fdXVpZD1kNDg1NWRmOS02Y2UwLTQ1Y2QtODFjYi1jZjg3MzdlMWU3YWEmY29udHJ" +
            "pYl91dWlkPTIwMTg2OGI3YWMyY2RhNDEwYTk5YjNlZDRjMTFhOGVhIiwgInByaWN" +
            "lUG9pbnQiOiAxLCAiaWQiOiAibWF1ZGU6ODUiLCAiZGVzY3JpcHRpb24iOiAiVGh" +
            "pcyBhcHAgaGFzIGJlZW4gYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgPGEgaHJ" +
            "lZj1cImh0dHA6Ly9vdXRnb2luZy5tb3ppbGxhLm9yZy92MS9iYTdmMzczYWUxNjc" +
            "4OWVmZjNhYmZkOTVjYThkM2MxNWQxOGRjOTAwOWFmYTIwNGRjNDNmODVhNTViMWY" +
            "2ZWYxL2h0dHAlM0EvL3Rlc3RtYW5pZmVzdC5jb21cIiByZWw9XCJub2ZvbGxvd1w" +
            "iPnRlc3RtYW5pZmVzdC5jb208L2E-In0sICJleHAiOiAxMzU4Mzc5MTQ3LCAiaWF" +
            "0IjogMTM1ODM3NTU0NywgInR5cCI6ICJtb3ppbGxhL3BheW1lbnRzL3BheS92MSJ" +
            "9.kgSt636OSRBezMGtm9QLeDxlEOevL4xcOoDj8VRJyD8";

  testGetPaymentRequest(providers, {
    jwt: jwt,
    ret: true,
    error: null,
    result: {
      type: type,
      providerName: providers[type].name
    }
  });

  run_next_test();
});

add_test(function test_empty_jwt() {
  testGetPaymentRequest(null, {
    jwt: "",
    ret: true,
    error: "INTERNAL_ERROR_CALL_WITH_MISSING_JWT"
  });

  run_next_test();
});

add_test(function test_wrong_segments_count() {
  // 1 segment JWT
  let OneSegJwt = "eyJhbGciOiJIUzI1NiJ9";
  testGetPaymentRequest(null, {
    jwt: OneSegJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_WRONG_SEGMENTS_COUNT"
  });

  // 2 segments JWT
  let TwoSegJwt = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNTg2NDkwMTM2NTY2N" +
                  "zU1ODY2MSIsImF1ZCI6Ikdvb2dsZSIsInR5cCI6Imdvb2dsZS9" +
                  "wYXltZW50cy9pbmFwcC9pdGVtL3YxIiwiaWF0IjoxMzUyMjIwM" +
                  "jEyLCJleHAiOjEzNTIzMDY2MTIsInJlcXVlc3QiOnsiY3VycmV" +
                  "uY3lDb2RlIjoiVVNEIiwicHJpY2UiOiIzLjAwIiwibmFtZSI6I" +
                  "kdvbGQgU3RhciIsInNlbGxlckRhdGEiOiJzb21lIG9wYXF1ZSB" +
                  "kYXRhIiwiZGVzY3JpcHRpb24iOiJBIHNoaW5pbmcgYmFkZ2Ugb" +
                  "2YgZGlzdGluY3Rpb24ifX0";

  testGetPaymentRequest(null, {
    jwt: TwoSegJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_WRONG_SEGMENTS_COUNT"
  });

  run_next_test();
});

add_test(function test_empty_payload() {
  let EmptyPayloadJwt = "eyJhbGciOiJIUzI1NiJ9..eyJpc3MiOiIwNTg2NDkwMTM2NTY2N";

  testGetPaymentRequest(null, {
    jwt: EmptyPayloadJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_EMPTY_PAYLOAD"
  });

  run_next_test();
});

add_test(function test_missing_typ_parameter() {
  // Payload
  //  {
  //    "iss": "640ae477-df33-45cd-83b8-6f1f910a6494",
  //    "iat": 1361203745,
  //    "request": {
  //      "description": "detailed description",
  //      "id": "799db970-7afa-4028-bdb7-8b045eb8babc",
  //      "postbackURL": "http://inapp-pay-test.farmdev.com/postback",
  //      "productData": "transaction_id=58",
  //      "pricePoint": 1,
  //      "chargebackURL": "http://inapp-pay-test.farmdev.com/chargeback",
  //      "name": "The Product"
  //    },
  //    "aud": "marketplace-dev.allizom.org",
  //    "exp": 1361207345
  //  }
  let missingTypJwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9." +
                      "eyJpc3MiOiAiNjQwYWU0NzctZGYzMy00NWNkLTgzY" +
                      "jgtNmYxZjkxMGE2NDk0IiwgImlhdCI6IDEzNjEyMD" +
                      "M3NDUsICJyZXF1ZXN0IjogeyJkZXNjcmlwdGlvbiI" +
                      "6ICJkZXRhaWxlZCBkZXNjcmlwdGlvbiIsICJpZCI6" +
                      "ICI3OTlkYjk3MC03YWZhLTQwMjgtYmRiNy04YjA0N" +
                      "WViOGJhYmMiLCAicG9zdGJhY2tVUkwiOiAiaHR0cD" +
                      "ovL2luYXBwLXBheS10ZXN0LmZhcm1kZXYuY29tL3B" +
                      "vc3RiYWNrIiwgInByb2R1Y3REYXRhIjogInRyYW5z" +
                      "YWN0aW9uX2lkPTU4IiwgInByaWNlUG9pbnQiOiAxL" +
                      "CAiY2hhcmdlYmFja1VSTCI6ICJodHRwOi8vaW5hcH" +
                      "AtcGF5LXRlc3QuZmFybWRldi5jb20vY2hhcmdlYmF" +
                      "jayIsICJuYW1lIjogIlRoZSBQcm9kdWN0In0sICJh" +
                      "dWQiOiAibWFya2V0cGxhY2UtZGV2LmFsbGl6b20ub" +
                      "3JnIiwgImV4cCI6IDEzNjEyMDczNDV9.KAHsJX1Hy" +
                      "fmwNvAckdVUqlpPvdHggpx9yX276TWacRg";
  testGetPaymentRequest(null, {
    jwt: missingTypJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_NO_TYP_PARAMETER"
  });

  run_next_test();
});

add_test(function test_missing_request_parameter() {
  // Payload
  //  {
  //    "iss": "Enter you app key here!",
  //    "iat": 1352225299,
  //    "typ": "mock/payments/inapp/v1",
  //    "aud": "mockpayprovider.phpfogapp.com",
  //    "exp": 1352228899
  //  }
  let missingRequestJwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9." +
                          "eyJpc3MiOiAiRW50ZXIgeW91IGFwcCBrZXkgaGVyZ" +
                          "SEiLCAiaWF0IjogMTM1MjIyNTI5OSwgInR5cCI6IC" +
                          "Jtb2NrL3BheW1lbnRzL2luYXBwL3YxIiwgImF1ZCI" +
                          "6ICJtb2NrcGF5cHJvdmlkZXIucGhwZm9nYXBwLmNv" +
                          "bSIsICJleHAiOiAxMzUyMjI4ODk5fQ.yXGinvZiUs" +
                          "v9JWvdfM6zPD0iOX9DgCPcIwIbCrL4tcs";

  testGetPaymentRequest(null, {
    jwt: missingRequestJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_NO_REQUEST_PARAMETER"
  });

  run_next_test();
});

add_test(function test_jwt_decoding_error() {
  let wrongJwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.^eyJhdWQiOiAibW9" +
                 "a3BheXByb3ZpZGVyLnBocGZvZ2FwcC5jb20iLCAiaXNzIjogIkVudGVyI" +
                 "HlvdSBhcHAga2V5IGhlcmUhIiwgInJlcXVlc3QiOiB7Im5hbWUiOiAiUG" +
                 "llY2Ugb2YgQ2FrZSIsICJwcmljZSI6ICIxMC41MCIsICJwcmljZVRpZXI" +
                 "iOiAxLCAicHJvZHVjdGRhdGEiOiAidHJhbnNhY3Rpb25faWQ9ODYiLCAi" +
                 "Y3VycmVuY3lDb2RlIjogIlVTRCIsICJkZXNjcmlwdGlvbiI6ICJWaXJ0d" +
                 "WFsIGNob2NvbGF0ZSBjYWtlIHRvIGZpbGwgeW91ciB2aXJ0dWFsIHR1bW" +
                 "15In0sICJleHAiOiAxMzUyMjMyNzkyLCAiaWF0IjogMTM1MjIyOTE5Miw" +
                 "gInR5cCI6ICJtb2NrL3BheW1lbnRzL2luYXBwL3YxIn0.QZxc62USCy4U" +
                 "IyKIC1TKelVhNklvk-Ou1l_daKntaFI";

  testGetPaymentRequest(null, {
    jwt: wrongJwt,
    ret: true,
    error: "PAY_REQUEST_ERROR_ERROR_DECODING_JWT"
  });

  run_next_test();
});

add_test(function test_non_https_provider() {
  let providers = {};
  let type = "mock/payments/inapp/v1";
  providers[type] = {
    name: "mockprovider",
    description: "Mock Payment Provider",
    uri: "http://mockpayprovider.phpfogapp.com/?req=",
    requestMethod: "GET"
  };

  // Payload
  //  {
  //    "aud": "mockpayprovider.phpfogapp.com",
  //    "iss": "Enter you app key here!",
  //    "request": {
  //      "name": "Piece of Cake",
  //      "price": "10.50",
  //      "priceTier": 1,
  //      "productdata": "transaction_id=86",
  //      "currencyCode": "USD",
  //      "description": "Virtual chocolate cake to fill your virtual tummy"
  //    },
  //    "exp": 1352232792,
  //    "iat": 1352229192,
  //    "typ": "mock/payments/inapp/v1"
  //  }
  let jwt = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJhdWQiOiAibW9j" +
            "a3BheXByb3ZpZGVyLnBocGZvZ2FwcC5jb20iLCAiaXNzIjogIkVudGVyI" +
            "HlvdSBhcHAga2V5IGhlcmUhIiwgInJlcXVlc3QiOiB7Im5hbWUiOiAiUG" +
            "llY2Ugb2YgQ2FrZSIsICJwcmljZSI6ICIxMC41MCIsICJwcmljZVRpZXI" +
            "iOiAxLCAicHJvZHVjdGRhdGEiOiAidHJhbnNhY3Rpb25faWQ9ODYiLCAi" +
            "Y3VycmVuY3lDb2RlIjogIlVTRCIsICJkZXNjcmlwdGlvbiI6ICJWaXJ0d" +
            "WFsIGNob2NvbGF0ZSBjYWtlIHRvIGZpbGwgeW91ciB2aXJ0dWFsIHR1bW" +
            "15In0sICJleHAiOiAxMzUyMjMyNzkyLCAiaWF0IjogMTM1MjIyOTE5Miw" +
            "gInR5cCI6ICJtb2NrL3BheW1lbnRzL2luYXBwL3YxIn0.QZxc62USCy4U" +
            "IyKIC1TKelVhNklvk-Ou1l_daKntaFI";

  testGetPaymentRequest(providers, {
    jwt: jwt,
    ret: true,
    error: "INTERNAL_ERROR_NON_HTTPS_PROVIDER_URI"
  });

  run_next_test();
});
