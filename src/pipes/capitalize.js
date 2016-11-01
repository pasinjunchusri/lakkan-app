"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
/*
 Generated class for the Capitalize pipe.

 See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 Angular 2 Pipes.
 */
var Capitalize = (function () {
    function Capitalize() {
    }
    /*
     Takes a value and makes it lowercase.
     */
    Capitalize.prototype.transform = function (value, args) {
        return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
    };
    Capitalize = __decorate([
        core_1.Pipe({
            name: 'capitalize'
        }),
        core_1.Injectable()
    ], Capitalize);
    return Capitalize;
}());
exports.Capitalize = Capitalize;
