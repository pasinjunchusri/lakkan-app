import {Injectable} from '@angular/core';

@Injectable()
export class Auth {
    mSessionToken: any;

    constructor() {
        console.log('Hello Auth Provider');
        this.mSessionToken = Parse.User.current();
    }


    currentUser() {
        return Parse.User.current();
    }

    recover(email) {
        return Parse.User.requestPasswordReset(email);
    }

    login(obj) {
        return Parse.User.logIn(obj.username, obj.password);
    }

    logout() {
        return Parse.User.logOut();
    }

}
