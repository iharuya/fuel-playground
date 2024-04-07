contract;

enum FizzBuzzResult {
  Fizz: (),
  Buzz: (),
  FizzBuzz: (),
  Other: u64,
}

abi FizzBuzz {
  fn fizz_buzz(n: u64) -> FizzBuzzResult;
}


impl FizzBuzz for Contract {
  fn fizz_buzz(n: u64) -> FizzBuzzResult {
    if n % 15 == 0 {
      FizzBuzzResult::FizzBuzz
    } else if n % 3 == 0 {
      FizzBuzzResult::Fizz
    } else if n % 5 == 0 {
      FizzBuzzResult::Buzz
    } else {
      FizzBuzzResult::Other(n)
    }
  }
}

// #[test]
// fn test_fizz_buzz() {
//   let caller = abi(FizzBuzz, CONTRACT_ID);
//   let mut result = caller.fizz_buzz(3);
//   assert(result == FizzBuzzResult::Fizz);
// }