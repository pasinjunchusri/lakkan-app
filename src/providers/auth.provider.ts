import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class AuthProvider {
    private _mSessionToken: any;
    public current: any;

    constructor() {
        this._mSessionToken = Parse.User.current();
        this.current        = Parse.User.current();
    }

    recover(email: string) {
        return Parse.User.requestPasswordReset(email);
    }

    login(obj) {
        return Parse.User.logIn(obj.username, obj.password);
    }

    logout() {
        return Parse.User.logOut();
    }

}
