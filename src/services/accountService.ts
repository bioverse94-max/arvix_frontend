import { mockAccounts } from "../data/mock/accounts";
import type { AccountProfile, AccountStatus } from "../types/account";

class AccountService {
  private accounts: AccountProfile[] = [...mockAccounts];

  public async getAccounts(): Promise<AccountProfile[]> {
    return [...this.accounts];
  }

  public async getMuleAccounts(): Promise<AccountProfile[]> {
    return this.accounts.filter((acc) => acc.role === "MULE" || acc.risk_score >= 70);
  }

  public async getAccountById(id: string): Promise<AccountProfile | undefined> {
    return this.accounts.find((acc) => acc.account_id === id || acc.vpa === id);
  }

  public async updateAccountStatus(id: string, status: AccountStatus): Promise<boolean> {
    const acc = this.accounts.find((a) => a.account_id === id);
    if (acc) {
      acc.status = status;
      return true;
    }
    return false;
  }
}

export const accountService = new AccountService();
