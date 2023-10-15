const NodeRSA = require("node-rsa");

describe("Test rsa loadKey", () => {
  test("Load public", async () => {
    //Prepare
    const key =
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGYAv73I12ZEBEqgJERAImH9p/\n" +
      "/6sSkUP3vXG2S9O3R4WDP3PBqiaLJFEKn1aGIhc6+hs2wjXc6RduVj/CZjppOzW1\n" +
      "Ni8q4S+PL1cYOimxX4PkwTGQkmg6VoPwELhOzuSEqsjalmzHg16FMY0JZTnKlyIw\n" +
      "CICvRL9MmmoW1RP1TwIDAQAB\n" +
      "-----END PUBLIC KEY-----";

    //Execute
    const result = require("../../utils/encryption").rsa.loadKey({ key });

    //Test
    expect(!!result.keyPair).toBe(true);
  });

  test("Load private", async () => {
    //Prepare
    const key =
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIICWwIBAAKBgQCZJ+rDmeiJzGMpOe4MNI+9DhZ+VnqplL6xUIQICexjU+02/F5H\n" +
      "2vkXzeAiaAb5DZghaKdf4GGckUbBcwyHc/PceuzkAAatKPPATB8ACQ38RXqdGLak\n" +
      "A7mo74GxUD0eKqbGeuue4nxmFUDDhcne0QPv4YLLlCYtOwWBsKikdKf8WQIDAQAB\n" +
      "AoGAM6REAqRYxm4GWZZQ8AihFuwzJXJfdeLT0dIGUveVn4BjEhFScQQizaX7l15g\n" +
      "S4YL7+fr1+Y+w54wr3XtmZa9eOawxdGY3YAknJpfSOK1mb1IJ714dF53KmJs7V8c\n" +
      "MlO/bkihQNLrJIetYLi31V+l4LOStviboNVRkNVcinmFK6kCQQD+c8cGgXmX03W7\n" +
      "SHdgW+Gv3bWR7v+5S+lvSqbIfWz6SYUEVZaQQbJuARd9Bodl2uYcvONW/TLgnhi3\n" +
      "Yk4hgT1HAkEAmhZntxvKY4b4TXZdohwlQV6ow7yRjyG4EXMTYW5xc0HqUmx+8nhW\n" +
      "zbYQSaGbCINfP1LLcnFpjkyOCMJdk39JXwJAZa1F/meGexDYnrnaWfrdODVT9LiY\n" +
      "HyciZIJkGwFjpq/yI0VAIOzfq+1rwV32hNDv2tPv1DbhObhzD/SMW/8UyQJAMjwX\n" +
      "uBSxWN1J2kc6o301kChCMP4rHlTJ47Z2nQ8aoY7dy91fTcF52zr9+GNdXdsmlEhz\n" +
      "122uEhxXOffT9iBLVQJAa7pXvb7gmXoXV0MMGwzBl+fucjnl5TRIp5CbILETWS9F\n" +
      "volGKmguKpLIchj+QYSisyXHsZ9a+k3ldBX/BVxXyg==\n" +
      "-----END RSA PRIVATE KEY-----";

    //Execute
    const result = require("../../utils/encryption").rsa.loadKey({ key });

    //Test
    expect(!!result.keyPair).toBe(true);
  });

  test("Load error", async () => {
    //Prepare
    const key = "Not a key";

    //Execute
    const result = require("../../utils/encryption").rsa.loadKey({ key });

    //Test
    expect(result).toBe(null);
  });
});

describe("Test rsa encryption/decrytion", () => {
  test("encryption/decrytion", async () => {
    //Prepare
    const keyPublicString =
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwEbJyN+BDA4YrpNXNeCgEeYDb\n" +
      "QYdiEl6FGmU+cyR8mH3jgbkw9SIjl19jpyaQL3rQYu6XJ8E8fV+izyauaUfGqA0X\n" +
      "RbkGGEpZxkkAk8e+RpOjPOt8F6oaryTqg1SZassHTvWs9nfC/kYH/MLVncveHGVC\n" +
      "bwLxzpkr1wfeUd9DAwIDAQAB\n" +
      "-----END PUBLIC KEY-----";
    const keyPublic = new NodeRSA(keyPublicString);
    const keyPrivateString =
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIICXAIBAAKBgQCwEbJyN+BDA4YrpNXNeCgEeYDbQYdiEl6FGmU+cyR8mH3jgbkw\n" +
      "9SIjl19jpyaQL3rQYu6XJ8E8fV+izyauaUfGqA0XRbkGGEpZxkkAk8e+RpOjPOt8\n" +
      "F6oaryTqg1SZassHTvWs9nfC/kYH/MLVncveHGVCbwLxzpkr1wfeUd9DAwIDAQAB\n" +
      "AoGALzuAIG3m5nNSkfC1PlqGebTSoX7xv5hn7NMI5/jhh98snlSVhpGsJ9oax9P2\n" +
      "X2WtT6vKj5glmYGUn0ts+ArcKvfPjcsZCLjUjkEjNmFAAdRsh/unqqtMHk0Zex20\n" +
      "U/yT+a5RSkTGEA1EtqDvla4GN147Ir7Qz54k2q8hVUxeSvkCQQDUcKTBCkeNuZn+\n" +
      "kZ8FaHaVmALQc3nHUxtAdBgNtPE+FgQi9fnDnxxH1LUBjmx1kO6YNxyhP7LWrZui\n" +
      "Bm8jzfylAkEA1Cvhc0yPmRfrVkrkjmkFMuC9pTCNebnNGxVoVb4nDCnVOiNdyCbY\n" +
      "5nRLzsaF74uKYekVmQ7EumC14IV7vGxohwJBALBwifWmcv1bvHG5Qmj8dRkTsqqs\n" +
      "beVFuemTQnMH6CFXqcHbp8B4gsWJ/Xe4cY5HfFLB2y51uDQi5pLwYxhKud0CQGw7\n" +
      "AiOFv46x4+u+An8e1XcRq8wTS2f3vsf9EJ8Eg/ixckLY/aL3JhfQ5UbSgEok3W96\n" +
      "rfjIztPgN4cTsH36swsCQA4QJak5Omkb0KTnk6Q9e8qm0kLo2VOe3LPXFY73Rk+2\n" +
      "CVm3BqS1NehnqgSxN98UgXRsT0z0NnFP8dQhh3qcbvQ=\n" +
      "-----END RSA PRIVATE KEY-----";
    const keyPrivate = new NodeRSA(keyPrivateString);
    const initData = { test: "test" };

    //Execute encryption
    const { encryptedData } = await require("../../utils/encryption").rsa.encrypt({ key: keyPublic, data: initData });

    //Test encryption
    expect(!!encryptedData).toBe(true);

    //Execute decryption
    const { decryptedData } = await require("../../utils/encryption").rsa.decrypt({
      key: keyPrivate,
      data: encryptedData,
    });

    //Test decryption
    expect(JSON.stringify(decryptedData)).toBe(JSON.stringify(initData));
  });
});

describe("Test aes encryption", () => {
  test("Encrypt message and create key", async () => {
    //Prepare
    const message = "Test encrypt";

    //Execute
    const result = require("../../utils/encryption").aes.encrypt({ message });

    //Test
    expect(!!result.messageHex).toBe(true);
    expect(!!result.keyBase64).toBe(true);
    expect(!!result.ivBase64).toBe(true);
  });

  test("Encrypt message with specific keys", async () => {
    //Prepare
    const message = "Test encrypt";
    const keyBase64 = "SENyKJ2V1cL7nTNH0k1/Mg==";
    const ivBase64 = "hMraShc9/XkTn2m0Iwtw6w==";

    //Execute
    const result = require("../../utils/encryption").aes.encrypt({ message, keyBase64, ivBase64 });

    //Test
    expect(result.messageHex).toBe("2ccec94d3149368cf52a9e97589b6432");
    expect(result.keyBase64).toBe(keyBase64);
    expect(result.ivBase64).toBe(ivBase64);
  });
});

describe("Test aes decryption", () => {
  test("Decrypt message", async () => {
    //Prepare
    const messageHex = "2ccec94d3149368cf52a9e97589b6432";
    const keyBase64 = "SENyKJ2V1cL7nTNH0k1/Mg==";
    const ivBase64 = "hMraShc9/XkTn2m0Iwtw6w==";

    //Execute
    const result = require("../../utils/encryption").aes.decrypt({ messageHex, keyBase64, ivBase64 });

    //Test
    expect(result).toBe("Test encrypt");
  });
});

describe("Test aes encryption and decryption", () => {
  test("Encrypt and decrypt", async () => {
    //Prepare
    const message = JSON.stringify({ query: "Kara fait des tests" });

    //Execute
    const { messageHex, keyBase64, ivBase64 } = require("../../utils/encryption").aes.encrypt({ message });
    const result = require("../../utils/encryption").aes.decrypt({ messageHex, keyBase64, ivBase64 });

    //Test
    expect(result).toBe(message);
  });
});

describe("Test encryption for request", () => {
  test("Encryption", async () => {
    //Prepare
    const keyPublicString =
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwEbJyN+BDA4YrpNXNeCgEeYDb\n" +
      "QYdiEl6FGmU+cyR8mH3jgbkw9SIjl19jpyaQL3rQYu6XJ8E8fV+izyauaUfGqA0X\n" +
      "RbkGGEpZxkkAk8e+RpOjPOt8F6oaryTqg1SZassHTvWs9nfC/kYH/MLVncveHGVC\n" +
      "bwLxzpkr1wfeUd9DAwIDAQAB\n" +
      "-----END PUBLIC KEY-----";
    const query = "This is a test message. Test avec des charactères très spéciaux";

    //Execute
    const result = await require("../../utils/encryption").encryptionForRequest({
      query,
      backPublicKey: keyPublicString,
    });

    //Test
    expect(!!result.aes).toBe(true);
    expect(!!result.data).toBe(true);
  });
});

describe("Test decryption for result", () => {
  test("Decryption", async () => {
    //Prepare
    const keyPrivateString =
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIICXgIBAAKBgQDKBVEb0V14yZe824p++J4WrldboXRXoBJZbFmJukFaRXqMhu2i\n" +
      "o9Z+8onfbeMMfkbD21YLPivZYLx52v7qocq+znVtU/F77LrnsP6tUMLQKaUDMOM6\n" +
      "J1i+lLjsFnxJO0IdQNOk6hHPcre88pGDlY8gUKGXzbYEu7v46szU9skpGwIDAQAB\n" +
      "AoGAfVVNG7gJiI1xQS7nPpzZ33JsKiIBvvdFSwtIhYTzVKD0RcjUF2oUAhBQ7zgK\n" +
      "e86/8nTabgE1TRiR9fui2UhlMl8iojR9agFJmjH6cqdXf/T6hRfe/mq7Kj561FFc\n" +
      "zNoTGsIxQcCXhI+Vdf6dLl2oiw4kTPWfTxFrI2XtuCZfsNECQQDrqIAKc5JKU6a/\n" +
      "0ahk4PkYMXkGNUXxSJVZb/c4P/yMk1xYQPrlQUsI97kEdBvwKcKSyxwNqpQEUUm+\n" +
      "ibFYtPS5AkEA23WB4nF2OCgBLrLuOyHiRcOXC+JHyiKXJDimhCD/YKc7BdNFP3tA\n" +
      "kFiW1Y7tPcdhysMG/IGN0DD2EyOwU3AKcwJBANz9rOUgMCXHgG4NnI7Ncoq/ijDK\n" +
      "MIbufC/dEccMKjdh0Y1pkl7+9fC47iZBBBoZ7z9dfTdLqXbLDA7EbS00tPECQQC4\n" +
      "849DB9xZ910HvkSIEUZhBTWHDmzyLbSzEgtDz4tqKYXUovj5RyZigEaeNJY8Ooxw\n" +
      "FW0N4SFjE+BOwQUZTJOBAkEA6Ch5im1xvBW3iDo2JVKMzjNZu/FvOMxdgrox+JmU\n" +
      "GJa5L3R9piU4RzntMb04KG3BLZ9jTUzIUafLlusDhI6mdw==\n" +
      "-----END RSA PRIVATE KEY-----";
    const data = {
      aes: "a9eTCsLtKXNFzsKAdAOpOpfczmTu7Eh1o9yecGtWlmvxhlBeqV6KFljK7YYSWkD5SnaaAa76yPknhlpsCY8kyjpPayJw2B68QSAqZEDmjS3OTDZunC/Z4NRSG5a0h2fy9UKr9KYLvw4xDjxlPEj/yA9q0VSQGOxn3O+4m7r2h6o=",
      data: "330c28589035ff92e6f86a786ddb98d6cc4a15f91b4b6c2601d2e891d405dacd22db25d4ed9e3037f0937fdda4835dcd68942cd3d1fd4a7eabc4e40b8d214861855ac9c618e495d8c5c7fe808c22bfa8c40ef99080193de7a03f91c7fb85bbda97136e78399b282eac6995dff0ec4948937e1391f6320c245bd05b28e3c4edb30935525e4652646ec576f97e11c28e4580b960ee772ca0f2663f54281cfaa3872d56b5ff64a4e959c41add36d38ebba495690973a16a626deabc4f9750673a7d661e27c9de610477084d2053de8c9bd8901699c2ab509b06e67e9398bd52676486287cc0df7610eab268cadcfbc0a1c2",
    };

    //Executeawait decryptionForResult({ clientPrivateKey, data: dataRequest });
    const result = await require("../../utils/encryption").decryptionForResult({
      clientPrivateKey: keyPrivateString,
      data: data,
    });

    //Test
    expect(result.result).toBe("Quelle est la ville, dont vous souhaitez connaître la météo ?");
    expect(!!result.similarity).toBe(true);
    expect(!!result.bestPhrase).toBe(true);
    expect(result.shortAnswerExpected).toBe(true);
    expect(!!result.lang).toBe(true);
    expect(!!result.skill).toBe(true);
  });
});
