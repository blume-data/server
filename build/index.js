!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=9)}([function(e,t){e.exports=require("express")},function(e,t){e.exports=require("@ranjodhbirkaur/common")},function(e,t){e.exports=require("mongoose")},function(e,t){e.exports=require("express-validator")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.Password=void 0;var o=r(7),u=r(18).promisify(o.scrypt),s=function(){function e(){}return e.toHash=function(e){return n(this,void 0,void 0,(function(){var t;return i(this,(function(r){switch(r.label){case 0:return t=o.randomBytes(8).toString("hex"),[4,u(e,t,64)];case 1:return[2,r.sent().toString("hex")+"."+t]}}))}))},e.compare=function(e,t){return n(this,void 0,void 0,(function(){var r,n,o;return i(this,(function(i){switch(i.label){case 0:return r=e.split("."),n=r[0],o=r[1],[4,u(t,o,64)];case 1:return[2,i.sent().toString("hex")===n]}}))}))},e}();t.Password=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.rootUrl=t.stringLimitOptionErrorMessage=t.stringLimitOptions=void 0,t.stringLimitOptions={min:2,max:40},t.stringLimitOptionErrorMessage=function(e){return e+" must be between 2 and 40 characters"},t.rootUrl="/api/auth/"},function(e,t){e.exports=require("jsonwebtoken")},function(e,t){e.exports=require("crypto")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.TempUser=void 0;var u=o(r(2)),s=r(4),a=new u.default.Schema({email:{type:String,required:!0,unique:!0,lowercase:!0},password:{type:String,required:!0},firstName:{type:String,required:!0},verificationToken:{type:String,required:!0},lastName:{type:String,required:!0},userName:{type:String,required:!0},isVerified:{type:Boolean,required:!0},role:{type:String,required:!0},created_at:{type:Date,default:Date.now}},{toJSON:{transform:function(e,t){t.id=t._id,delete t._id,delete t.password,delete t.__v}}});a.pre("save",(function(e){return n(this,void 0,void 0,(function(){var t;return i(this,(function(r){switch(r.label){case 0:return this.isModified("password")?[4,s.Password.toHash(this.get("password"))]:[3,2];case 1:t=r.sent(),this.set("password",t),r.label=2;case 2:return e(),[2]}}))}))})),a.statics.build=function(e){return new l(e)};var l=u.default.model("TempUser",a);t.TempUser=l},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var u=o(r(2)),s=r(10);n(void 0,void 0,void 0,(function(){var e;return i(this,(function(t){switch(t.label){case 0:if(!process.env.JWT_KEY)throw new Error("JWT_KEY must be defined");if(!process.env.MONGO_URI)throw new Error("MONGO_URI must be defined");t.label=1;case 1:return t.trys.push([1,3,,4]),[4,u.default.connect(process.env.MONGO_URI,{useNewUrlParser:!0,useUnifiedTopology:!0,useCreateIndex:!0})];case 2:return t.sent(),console.log("Connected to MongoDb Auth"),[3,4];case 3:return e=t.sent(),console.error(e),[3,4];case 4:return s.app.listen(3e3,(function(){console.log("Auth is Listening on port 3000!!!")})),[2]}}))}))},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.app=void 0;var u=o(r(0));r(11);var s=r(12),a=o(r(13)),l=r(1),c=o(r(14)),f=o(r(15)),d=r(16),p=r(17),h=r(20),b=r(21),v=r(23),y=u.default();t.app=y,y.set("trust proxy",!0),y.use(f.default()),y.use(c.default()),y.use(s.json()),y.use(a.default({signed:!1,secure:!1})),y.use(d.currentUserRouter),y.use(p.signinRouter),y.use(h.signoutRouter),y.use(b.signupRouter),y.use(v.routes),y.all("*",(function(e,t){return n(void 0,void 0,void 0,(function(){return i(this,(function(e){throw new l.NotFoundError}))}))})),y.use(l.errorHandler)},function(e,t){e.exports=require("express-async-errors")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("cookie-session")},function(e,t){e.exports=require("cors")},function(e,t){e.exports=require("compression")},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.currentUserRouter=void 0;var i=n(r(0)),o=r(1),u=i.default.Router();t.currentUserRouter=u,u.get("/api/users/currentuser",o.currentUser,(function(e,t){t.send({currentUser:e.currentUser||null})}))},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.signinRouter=void 0;var u=o(r(0)),s=r(3),a=o(r(6)),l=r(1),c=r(4),f=r(19),d=r(5),p=u.default.Router();t.signinRouter=p,p.post(d.rootUrl+"signin",[s.body("email").isEmail().withMessage("Email must be valid"),s.body("password").trim().notEmpty().withMessage("You must supply a password")],l.validateRequest,(function(e,t){return n(void 0,void 0,void 0,(function(){var r,n,o,u,s;return i(this,(function(i){switch(i.label){case 0:return r=e.body,n=r.email,o=r.password,[4,f.User.findOne({email:n})];case 1:if(!(u=i.sent()))throw new l.BadRequestError("Invalid credentials");return[4,c.Password.compare(u.password,o)];case 2:if(!i.sent())throw new l.BadRequestError("Invalid Credentials");return s=a.default.sign({id:u.id,email:u.email},process.env.JWT_KEY),e.session={jwt:s},t.status(200).send(u),[2]}}))}))}))},function(e,t){e.exports=require("util")},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.User=void 0;var u=o(r(2)),s=r(4),a=new u.default.Schema({email:{type:String,required:!0},password:{type:String,required:!0}},{toJSON:{transform:function(e,t){t.id=t._id,delete t._id,delete t.password,delete t.__v}}});a.pre("save",(function(e){return n(this,void 0,void 0,(function(){var t;return i(this,(function(r){switch(r.label){case 0:return this.isModified("password")?[4,s.Password.toHash(this.get("password"))]:[3,2];case 1:t=r.sent(),this.set("password",t),r.label=2;case 2:return e(),[2]}}))}))})),a.statics.build=function(e){return new l(e)};var l=u.default.model("User",a);t.User=l},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.signoutRouter=void 0;var i=n(r(0)).default.Router();t.signoutRouter=i,i.post("/api/users/signout",(function(e,t){e.session=null,t.send({})}))},function(e,t,r){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)},i=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},u=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.signupRouter=void 0;var s=u(r(0)),a=r(3),l=u(r(6)),c=r(1),f=r(5),d=r(8),p=r(22),h=s.default.Router();t.signupRouter=h,h.post(f.rootUrl+"client/signup",[a.body("email").isEmail().withMessage("Email must be valid"),a.body("password").trim().isLength({min:6,max:20}).withMessage("Password must be between 4 and 20 characters"),a.body("firstName").isLength(f.stringLimitOptions).withMessage(f.stringLimitOptionErrorMessage("First name")),a.body("lastName").isLength(f.stringLimitOptions).withMessage(f.stringLimitOptionErrorMessage("Last name")),a.body("userName").isLength(f.stringLimitOptions).withMessage(f.stringLimitOptionErrorMessage("User name"))],c.validateRequest,(function(e,t){return i(void 0,void 0,void 0,(function(){var r,i,u,s,a,f,h,b,v,y;return o(this,(function(o){switch(o.label){case 0:return r=e.body,i=r.email,u=r.password,s=r.firstName,a=r.lastName,f=r.userName,[4,d.TempUser.findOne({email:i})];case 1:if(o.sent())throw new c.BadRequestError("Email in use");return[4,d.TempUser.findOne({userName:f})];case 2:if(o.sent())throw new c.BadRequestError("Username in use");return h=p.RANDOM_STRING(4),[4,(b=d.TempUser.build({email:i,password:u,firstName:s,isVerified:!1,lastName:a,role:"client",userName:f,verificationToken:h})).save()];case 3:return o.sent(),v={id:b.id,email:b.email,userName:b.userName},y=l.default.sign(v,process.env.JWT_KEY),e.session={jwt:y},t.status(201).send(n(n({},v),{accessToken:y})),[2]}}))}))}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.RANDOM_STRING=void 0;var n=r(7);t.RANDOM_STRING=function(e){return void 0===e&&(e=4),n.randomBytes(e).toString("hex")}},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.routes=void 0;var i=n(r(0)),o=r(5),u=r(3),s=r(1),a=r(24),l=i.default.Router();t.routes=l,l.post(o.rootUrl+"client/validate/username",[u.body("userName").trim().notEmpty().withMessage("username is required").isLength(o.stringLimitOptions).withMessage(o.stringLimitOptionErrorMessage("username"))],s.validateRequest,a.isUserNameAvailable)},function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,o){function u(e){try{a(n.next(e))}catch(e){o(e)}}function s(e){try{a(n.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,s)}a((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,n=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.isUserNameAvailable=void 0;var o=r(8);t.isUserNameAvailable=function(e,t){return n(this,void 0,void 0,(function(){var r,n;return i(this,(function(i){switch(i.label){case 0:return(r=e.body)&&r.userName?[4,o.TempUser.findOne({userName:r.userName})]:[3,2];case 1:n=i.sent(),console.log("user exist",n),n?t.status(200).send(!1):t.status(200).send(!0),i.label=2;case 2:return[2]}}))}))}}]);