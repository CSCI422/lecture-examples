type Account = {
  name: string
}

const getAccountName = (account: Account): string => {
    return account.name;
}

console.log(getAccountName({ 'name': 'Ethan' }));
