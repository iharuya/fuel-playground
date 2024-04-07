use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(Contract(
    name = "FizzBuzz",
    abi = "out/debug/fizzbuzz-abi.json"
));

async fn get_contract_instance() -> (FizzBuzz<WalletUnlocked>, ContractId) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./out/debug/fizzbuzz.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = FizzBuzz::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn test_fizzbuzz() {
    let (instance, _id) = get_contract_instance().await;

    let mut result = instance.methods().fizz_buzz(1500).call().await.unwrap();
    assert_eq!(result.value, FizzBuzzResult::FizzBuzz);

    result = instance.methods().fizz_buzz(9).call().await.unwrap();
    assert_eq!(result.value, FizzBuzzResult::Fizz);

    result = instance.methods().fizz_buzz(50).call().await.unwrap();
    assert_eq!(result.value, FizzBuzzResult::Buzz);
}
