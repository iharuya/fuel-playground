contract;

storage {
  count: u64 = 0
}

abi Counter {
  #[storage(read)]
  fn get() -> u64;

  #[storage(read, write)]
  fn inc() -> u64;

  #[storage(read, write)]
  fn dec() -> u64;
}

impl Counter for Contract {
  #[storage(read)]
  fn get() -> u64 {
    storage.count.read()
  }

  #[storage(read, write)]
  fn inc() -> u64 {
    let result = storage.count.read() + 1;
    storage.count.write(result);
    result
  }

  #[storage(read, write)]
  fn dec() -> u64 {
    let result = storage.count.read() - 1;
    storage.count.write(result);
    result
  }
}
