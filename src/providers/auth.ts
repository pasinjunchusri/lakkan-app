import {Injectable} from '@angular/core';

@Injectable()
export class Auth {
    mSessionToken: any;

    constructor() {
        console.log('Hello Auth Provider');
        this.mSessionToken = Parse.User.current();
    }


    getLoggedUser() {
        return Parse.User.current();
    }

    setSessionToken(sessionToken) {
        this.mSessionToken = sessionToken;
    }

    ensureLoggedIn() {
        return new Promise((resolve, reject) => {
            if (this.mSessionToken === null) {
                reject('Session token invalid');
            }

            if (!Parse.User.current()) {
                Parse.User.become(this.mSessionToken).then(resolve, reject);
            } else {
                resolve(Parse.User.current());
            }
        });
    }

    recoverPassword(email) {
        return Parse.User.requestPasswordReset(email);
    }

    logIn(obj) {
        return Parse.User.logIn(obj.username, obj.password);
        ;
    }

    logOut() {
        return Parse.User.logOut();
    }

}
