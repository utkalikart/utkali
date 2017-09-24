/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var _ = require('underscore');
var urlBindWithService = {
  "/api/register"             : [
                                  "/sign-in",
                                  "/register",
                                  "/pre-validate-register",
                                  "/post-validate-register",
                                  "/error-register",
                                  "/forgot-password",
                                  "/confirm-password",
                                  "/confirm-password-mail",
                                  "/confirm-password-mail-sent"
                                ],
    "/api/createuser"         : [
                                  "/create-user",
                                  "/create-user-admin"
                                ],
    "/api/permission"         : [
                                  "/permission-user"
                                ],
    "/api/role"               : [
                                  "/create-role"
                                ],

    "/api/build-questions"    : [
                                  "/build-questions"
                                ],
    "/api/build-questions-set"    : [
                                  "/build-questions-set"
                                ],
    "/api/practice-test"      : [
                                  "/practice-test"
                                ],
    "/api/dashboard"          : [
                                  "/index"
                                ]
};
var publicServiceUrls = [
    "/api/Register/loginProcess",
    "/api/Register/forgotPasswordProcess"  ,
    "/api/Register/confirmPasswordProcess",
    "/api/register/registerProcess",
    "/api/Register/logOutProcess",
    "/api/RISK/getScore",
  "/api/register/validateMailParam",
  "/api/createuser/getAllImage",
  "/api/createuser/searchAllItemProcess",
  "/api/dashboard/getAllSuccessfulTransaction",
  "/api/createuser/findProductsProcess",
  "/api/createuser/sortPriceHighToLowProcess",
  "/api/createuser/sortPriceLowToHighProcess",
  "/api/createuser/sortInStockProductProcess",
  "/api/createuser/sortOutOfStockProductProcess",
  "/api/createuser/sorBothProductProcess"


]
module.exports = function(app) {
  app.use(function(req,res,next) {
    // First we extract token from request header
    var token = req.headers.authorization;

    // we are not do validation for loginProcess and validateFhirData
    // we check all request which is have “ api “ in request url.

    if (/^\/api/.test(req.url) && publicServiceUrls.indexOf(req.url) == -1) {
      // check token provided in header or not
      if (typeof token == "undefined" || token == null) {
        return res.status(401).send('Unauthorized');
      } else {
        // extract actual token by excluding “ Bearer: “ string
        var actualToken = token.replace('Bearer:', '');

        var snomedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJQcmF0aWsiLCJsYXN0bmFtZSI6IkJoYWRpeWFkcmEiLCJ1c2VybmFtZSI6IlByYXRpayIsInJvbGUiOlt7InBlcm1pc3Npb25MaXN0IjpbeyJwZXJtaXNzaW9uVXJsIjoiL3ByZS12YWxpZGF0ZS1yZWdpc3RlciIsImRpc3BsYXlOYW1lMiI6InByZS12YWxpZGF0ZS1yZWdpc3RlciIsImRpc3BsYXlOYW1lIjoiMTExIiwibmFtZSI6InByZS12YWxpZGF0ZS1yZWdpc3RlciIsIl9pZCI6IjU4YzVjMjRkNTI2OTk2NThiMDY1NzhlZSJ9LHsicGVybWlzc2lvblVybCI6Ii9sZWZ0LXNpZGViYXIiLCJkaXNwbGF5TmFtZTIiOiJsZWZ0LXNpZGViYXIiLCJkaXNwbGF5TmFtZSI6ImxlZnQtc2lkZWJhciIsIm5hbWUiOiJsZWZ0LXNpZGViYXIiLCJfaWQiOiI1OGM1YzI1ODUyNjk5NjU4YjA2NTc4ZWYifSx7InBlcm1pc3Npb25VcmwiOiIvcmVnaXN0ZXIiLCJkaXNwbGF5TmFtZTIiOiJyZWdpc3RlciIsImRpc3BsYXlOYW1lIjoidGhlIiwibmFtZSI6InJlZ2lzdGVyIiwiX2lkIjoiNThjNWMyNmY1MjY5OTY1OGIwNjU3OGYwIn0seyJwZXJtaXNzaW9uVXJsIjoiL2Nlcm5lci1wcm9maWxlIiwiZGlzcGxheU5hbWUyIjoiRUhSLWNlcm5lci1wcm9maWxlIiwiZGlzcGxheU5hbWUiOiJyZWdpc3RlciIsIm5hbWUiOiJFSFItY2VybmVyLXByb2ZpbGUiLCJfaWQiOiI1OGM1YzI3ZDUyNjk5NjU4YjA2NTc4ZjEifSx7InBlcm1pc3Npb25VcmwiOiIvY29uZmlybS1wYXNzd29yZC1tYWlsIiwiZGlzcGxheU5hbWUyIjoiY29uZmlybS1wYXNzd29yZC1tYWlsIiwiZGlzcGxheU5hbWUiOiJjcmVhdGUtdXNlci1hZG1pbiIsIm5hbWUiOiJjb25maXJtLXBhc3N3b3JkLW1haWwiLCJfaWQiOiI1OGM1YzI4YzUyNjk5NjU4YjA2NTc4ZjIifSx7InBlcm1pc3Npb25VcmwiOiIvcHJlLXZhbGlkYXRlLXJlZ2lzdGVyIiwiZGlzcGxheU5hbWUyIjoicHJlLXZhbGlkYXRlLXJlZ2lzdGVyIiwiZGlzcGxheU5hbWUiOiJjcmVhdGUtcm9sZSIsIm5hbWUiOiJwcmUtdmFsaWRhdGUtcmVnaXN0ZXIiLCJfaWQiOiI1OGM1YzJhYTUyNjk5NjU4YjA2NTc4ZjQifSx7InBlcm1pc3Npb25VcmwiOiIvZmhpcmRhdGFwcm9jZXNzaW5nIiwiZGlzcGxheU5hbWUyIjoiZmhpcmRhdGFwcm9jZXNzaW5nIiwiZGlzcGxheU5hbWUiOiJmaGlyIGRhdGEgcHJvY2Vzc2luZyIsIm5hbWUiOiJmaGlyZGF0YXByb2Nlc3NpbmciLCJfaWQiOiI1OGM1YzJjMDUyNjk5NjU4YjA2NTc4ZjUifSx7InBlcm1pc3Npb25VcmwiOiIvcmVnaXN0ZXItZmhpciIsImRpc3BsYXlOYW1lMiI6InJlZ2lzdGVyLWZoaXIiLCJkaXNwbGF5TmFtZSI6ImZoaXIgcmVzb3VyY2VzIiwibmFtZSI6InJlZ2lzdGVyLWZoaXIiLCJfaWQiOiI1OGM1YzJlMDUyNjk5NjU4YjA2NTc4ZjYifSx7InBlcm1pc3Npb25VcmwiOiIvbG9pbmMiLCJkaXNwbGF5TmFtZTIiOiJDQS1sb2luYyIsImRpc3BsYXlOYW1lIjoiZmhpciBwcm9maWxlIiwibmFtZSI6IkNBLWxvaW5jIiwiX2lkIjoiNThjNWMyZjI1MjY5OTY1OGIwNjU3OGY3In0seyJwZXJtaXNzaW9uVXJsIjoiL0VwaWMtbG9naW4iLCJkaXNwbGF5TmFtZTIiOiJFSFItZXBpYy1wcm9maWxlIiwiZGlzcGxheU5hbWUiOiJidWlsZCBmaGlyIHJlc291cmNlcyIsIm5hbWUiOiJFSFItZXBpYy1wcm9maWxlIiwiX2lkIjoiNThjNWMzMWY1MjY5OTY1OGIwNjU3OGY4In0seyJwZXJtaXNzaW9uVXJsIjoiL3JlZ2lzdGVyLWZoaXIiLCJkaXNwbGF5TmFtZTIiOiJyZWdpc3Rlci1maGlyIiwiZGlzcGxheU5hbWUiOiJyeC1ub3JtIiwibmFtZSI6InJlZ2lzdGVyLWZoaXIiLCJfaWQiOiI1OGM1YzMzNTUyNjk5NjU4YjA2NTc4ZjkifSx7InBlcm1pc3Npb25VcmwiOiIvc25vZW1lZCIsImRpc3BsYXlOYW1lMiI6IkNBLXNub2VtZWQiLCJkaXNwbGF5TmFtZSI6InNub2VtZWQiLCJuYW1lIjoiQ0Etc25vZW1lZCIsIl9pZCI6IjU4YzVjMzQwNTI2OTk2NThiMDY1NzhmYSJ9LHsicGVybWlzc2lvblVybCI6Ii9jb2xvci1tYW5hZ2VtZW50IiwiZGlzcGxheU5hbWUyIjoiYWRtaW4tY29sb3ItbWFuYWdlbWVudCIsImRpc3BsYXlOYW1lIjoiaWNkIiwibmFtZSI6ImFkbWluLWNvbG9yLW1hbmFnZW1lbnQiLCJfaWQiOiI1OGM1YzM1MTUyNjk5NjU4YjA2NTc4ZmIifSx7InBlcm1pc3Npb25VcmwiOiIvbG9pbmMiLCJkaXNwbGF5TmFtZTIiOiJDQS1sb2luYyIsImRpc3BsYXlOYW1lIjoibG9pbmMiLCJuYW1lIjoiQ0EtbG9pbmMiLCJfaWQiOiI1OGM1YzM1ZTUyNjk5NjU4YjA2NTc4ZmMifSx7InBlcm1pc3Npb25VcmwiOiIvY2VybmVyLWRhdGEiLCJkaXNwbGF5TmFtZTIiOiJFSFItY2VybmVyLWRhdGEiLCJkaXNwbGF5TmFtZSI6ImNlcm5lciIsIm5hbWUiOiJFSFItY2VybmVyLWRhdGEiLCJfaWQiOiI1OGM1YzM2ZTUyNjk5NjU4YjA2NTc4ZmQifSx7InBlcm1pc3Npb25VcmwiOiIvcmVnaXN0ZXIiLCJkaXNwbGF5TmFtZTIiOiJyZWdpc3RlciIsImRpc3BsYXlOYW1lIjoiYWxsIHNjcmlwdCIsIm5hbWUiOiJyZWdpc3RlciIsIl9pZCI6IjU4YzVjMzdjNTI2OTk2NThiMDY1NzhmZSJ9LHsicGVybWlzc2lvblVybCI6Ii9yZWdpc3RlciIsImRpc3BsYXlOYW1lMiI6InJlZ2lzdGVyIiwiZGlzcGxheU5hbWUiOiJpbmRleCIsIm5hbWUiOiJyZWdpc3RlciIsIl9pZCI6IjU4YzVjM2E5NTI2OTk2NThiMDY1NzhmZiJ9LHsicGVybWlzc2lvblVybCI6Ii9wZXJtaXNzaW9uLXVzZXIiLCJkaXNwbGF5TmFtZTIiOiJwZXJtaXNzaW9uLXVzZXIiLCJkaXNwbGF5TmFtZSI6InBlcm1pc3Npb24iLCJuYW1lIjoicGVybWlzc2lvbi11c2VyIiwiX2lkIjoiNThjNWM1NzU5N2M3YjM1OTBjYzQ3MTJkIn0seyJwZXJtaXNzaW9uVXJsIjoiL3ByZS12YWxpZGF0ZS1yZWdpc3RlciIsImRpc3BsYXlOYW1lMiI6InByZS12YWxpZGF0ZS1yZWdpc3RlciIsImRpc3BsYXlOYW1lIjoiTWVkaXRlY2giLCJuYW1lIjoicHJlLXZhbGlkYXRlLXJlZ2lzdGVyIiwiX2lkIjoiNThjNmNlZWU5N2M3YjM1OTBjYzQ3MTM2In0seyJwZXJtaXNzaW9uVXJsIjoiL2ZvcmdvdC1wYXNzd29yZC1maGlyIiwiZGlzcGxheU5hbWUyIjoiZm9yZ290LXBhc3N3b3JkLWZoaXIiLCJkaXNwbGF5TmFtZSI6InBhc3N3IiwibmFtZSI6ImZvcmdvdC1wYXNzd29yZC1maGlyIiwiX2lkIjoiNThjYTM2YzMwYjI2MzYwOWQwNTczZTY2In0seyJwZXJtaXNzaW9uVXJsIjoiL2NvbmZpcm0tcGFzc3dvcmQtbWFpbC1zZW50IiwiZGlzcGxheU5hbWUyIjoiY29uZmlybS1wYXNzd29yZC1tYWlsLXNlbnQiLCJkaXNwbGF5TmFtZSI6ImljZDEiLCJuYW1lIjoiY29uZmlybS1wYXNzd29yZC1tYWlsLXNlbnQiLCJfaWQiOiI1OGNhNDExODBiMjYzNjA5ZDA1NzNlNjkifSx7InBlcm1pc3Npb25VcmwiOiIvc2lnbi1pbiIsImRpc3BsYXlOYW1lMiI6ImxvZ2luLW1haW4iLCJkaXNwbGF5TmFtZSI6ImxvZyIsIm5hbWUiOiJsb2dpbi1tYWluIiwiX2lkIjoiNThjYTU1NWJmNDQxNzkyOGQwZDEzMTFlIn0seyJwZXJtaXNzaW9uVXJsIjoiL3NpZ24taW4iLCJkaXNwbGF5TmFtZTIiOiJsb2dpbi1tYWluIiwiZGlzcGxheU5hbWUiOiJMb2dpbk1haW4yNDgiLCJuYW1lIjoibG9naW4tbWFpbiIsIl9pZCI6IjU4Y2E1ZTJmZjQ0MTc5MjhkMGQxMzEyMSJ9LHsicGVybWlzc2lvblVybCI6Ii9Vc2VyLVByb2ZpbGUiLCJkaXNwbGF5TmFtZTIiOiJVc2VyLVByb2ZpbGUiLCJkaXNwbGF5TmFtZSI6ImFiaGkiLCJuYW1lIjoiVXNlci1Qcm9maWxlIiwiX2lkIjoiNThjYTdiYTVmNDQxNzkyOGQwZDEzMTI2In0seyJwZXJtaXNzaW9uVXJsIjoiL3NpZ24taW4iLCJkaXNwbGF5TmFtZTIiOiJsb2dpbi1tYWluIiwiZGlzcGxheU5hbWUiOiJ0YXQ0MjEiLCJuYW1lIjoibG9naW4tbWFpbiIsIl9pZCI6IjU4Y2E3ZGVmZjQ0MTc5MjhkMGQxMzEyYyJ9LHsicGVybWlzc2lvblVybCI6Ii9pbmRleCIsImRpc3BsYXlOYW1lMiI6ImluZGV4IiwiZGlzcGxheU5hbWUiOiJEYXNoYm9hcmQiLCJuYW1lIjoiaW5kZXgiLCJfaWQiOiI1OGNhYzJiZjA5M2ZkNzRmZDM2NTUzNTQifSx7InBlcm1pc3Npb25VcmwiOiIvYnVpbGRmaGlycmVzb3VyY2VzIiwiZGlzcGxheU5hbWUyIjoiYnVpbGQtZmhpcnJlc291cmNlcyIsImRpc3BsYXlOYW1lIjoiL2J1aWxkRmhpciIsIm5hbWUiOiJidWlsZC1maGlycmVzb3VyY2VzIiwiX2lkIjoiNThjZjcyYjFmNzg1ODM1NzRkYmQyZThiIn0seyJwZXJtaXNzaW9uVXJsIjoiL2NyZWF0ZS1yb2xlIiwiZGlzcGxheU5hbWUyIjoiY3JlYXRlUm9sZSIsImRpc3BsYXlOYW1lIjoiY3JlYXRlIHJvbGUiLCJuYW1lIjoiY3JlYXRlUm9sZSIsIl9pZCI6IjU4ZDIxZGU5OTAyMTgyMDk1YzE1ODQwZCJ9LHsicGVybWlzc2lvblVybCI6Ii9jcmVhdGUtdXNlciIsImRpc3BsYXlOYW1lMiI6ImNyZWF0ZVVzZXIiLCJkaXNwbGF5TmFtZSI6ImNyZWF0ZSB1c2VyIiwibmFtZSI6ImNyZWF0ZVVzZXIiLCJfaWQiOiI1OGQyMWRmNjkwMjE4MjA5NWMxNTg0MGUifSx7InBlcm1pc3Npb25VcmwiOiIvY3JlYXRlLXVzZXItYWRtaW4iLCJkaXNwbGF5TmFtZTIiOiJjcmVhdGUtdXNlci1hZG1pbiIsImRpc3BsYXlOYW1lIjoiY3JlYXRlIGFkbWluIHVzZXIiLCJuYW1lIjoiY3JlYXRlLXVzZXItYWRtaW4iLCJfaWQiOiI1OGQyMWU4NDkwMjE4MjA5NWMxNTg0MGYifSx7InBlcm1pc3Npb25VcmwiOiIvcngtbm9ybSIsImRpc3BsYXlOYW1lMiI6InJ4LW5vcm0iLCJkaXNwbGF5TmFtZSI6InJ4Tm9ybSIsIm5hbWUiOiJyeC1ub3JtIiwiX2lkIjoiNThkM2E1YWQxZTYyMjgxMmY4ZGFlOGU4In0seyJwZXJtaXNzaW9uVXJsIjoiL2ZoaXJwcm9maWxlIiwiZGlzcGxheU5hbWUyIjoiZmhpcnByb2ZpbGUiLCJkaXNwbGF5TmFtZSI6ImZwYyIsIm5hbWUiOiJmaGlycHJvZmlsZSIsIl9pZCI6IjU4ZDNhNWZlMWU2MjI4MTJmOGRhZThlYSJ9LHsicGVybWlzc2lvblVybCI6Ii9maGlyZGF0YXR5cGVzIiwiZGlzcGxheU5hbWUyIjoiZmhpcmRhdGF0eXBlcyIsImRpc3BsYXlOYW1lIjoiZmR0YyIsIm5hbWUiOiJmaGlyZGF0YXR5cGVzIiwiX2lkIjoiNThkM2E2MzUxZTYyMjgxMmY4ZGFlOGViIn0seyJwZXJtaXNzaW9uVXJsIjoiL2ljZCIsImRpc3BsYXlOYW1lMiI6IkNBLWljZCIsImRpc3BsYXlOYW1lIjoiaWNkIiwibmFtZSI6IkNBLWljZCIsIl9pZCI6IjU4ZDNhNjg5MWU2MjI4MTJmOGRhZThlZCJ9LHsicGVybWlzc2lvblVybCI6Ii9mb3Jnb3QtcGFzc3dvcmQiLCJkaXNwbGF5TmFtZTIiOiJmb3Jnb3QtcGFzc3dvcmQiLCJkaXNwbGF5TmFtZSI6ImZvcmdvdDEiLCJuYW1lIjoiZm9yZ290LXBhc3N3b3JkIiwiX2lkIjoiNThkM2I2NmI4NzYzMGM3NjYyNWE5ZWQxIn0seyJwZXJtaXNzaW9uVXJsIjoiL2J1aWxkZmhpcmRhdGF0eXBlcyIsImRpc3BsYXlOYW1lMiI6ImJ1aWxkLWZoaXJkYXRhdHlwZXMiLCJkaXNwbGF5TmFtZSI6ImJ1aWxkIGZoaXIgZGF0YSB0eXBlcyIsIm5hbWUiOiJidWlsZC1maGlyZGF0YXR5cGVzIiwiX2lkIjoiNThkNzUxZGE3MzY3ZjE2ZTRkZTk0Mjc3In0seyJwZXJtaXNzaW9uVXJsIjoiL2J1aWxmaGlycHJvZmlsZSIsImRpc3BsYXlOYW1lMiI6ImJ1aWxkLWZoaXJwcm9maWxlIiwiZGlzcGxheU5hbWUiOiJidWlsZCBmaGlyIHByb2ZpbGUiLCJuYW1lIjoiYnVpbGQtZmhpcnByb2ZpbGUiLCJfaWQiOiI1OGQ3NTIxMTczNjdmMTZlNGRlOTQyNzgifSx7InBlcm1pc3Npb25VcmwiOiIvYnVpbGQtcXVlc3Rpb25zIiwiZGlzcGxheU5hbWUyIjoiYnVpbGQtcXVlc3Rpb25zIiwiZGlzcGxheU5hbWUiOiJidWlsZC1xdWVzdGlvbnMiLCJuYW1lIjoiYnVpbGQtcXVlc3Rpb25zIiwiX2lkIjoiNThkYzIyOWM5YmU0YWQ2ODllODE1YzYwIn0seyJwZXJtaXNzaW9uVXJsIjoiL3ByYWN0aWNlLXRlc3QiLCJkaXNwbGF5TmFtZTIiOiJwcmFjdGljZS10ZXN0IiwiZGlzcGxheU5hbWUiOiJwcmFjdGljZS10ZXN0IiwibmFtZSI6InByYWN0aWNlLXRlc3QiLCJfaWQiOiI1OGRkODA1M2ExOTc0ZjM1OTlmMmY3ZTYifSx7InBlcm1pc3Npb25VcmwiOiIvQ0hGLVJpc2stU2NvcmUiLCJkaXNwbGF5TmFtZTIiOiJDSEYtUmlzay1TY29yZSIsImRpc3BsYXlOYW1lIjoiQ0hGLVJpc2stU2NvcmUiLCJuYW1lIjoiQ0hGLVJpc2stU2NvcmUiLCJfaWQiOiI1OGUxNDg5OGE2YWZhMTMzYTc4NGUwYTEifV0sInJvbGVJZCI6IjE0ODkzNTU4MDk1ODkiLCJuYW1lIjoiQWRtaW4iLCJfaWQiOiI1OGM1YzQyMTUyNjk5NjU4YjA2NTc5MDAifV0sInByb2ZpbGVQaWN0dXJlIjoiL2Fzc2V0cy9pbWFnZXMvdXBsb2FkZWQvUHJhdGlrXzE0OTE4NDc4NTA0NTdfMTc2Mjk2NDhfMTEyMjY1NTM1OTgwODI4XzEyMjcyNzAyMjIyMjE1MzcwNDhfbi5qcGciLCJfaWQiOiI1OGM1YzRkMjk3YzdiMzU5MGNjNDcxMmIiLCJpYXQiOjE0OTI2NzQ2ODksImV4cCI6MTQ5Mjc2MTA4OX0.Zr5Ec7fmYHD-0UkgvcoH5rkQPStXWqe8-omkAKR2_oI"

        if(req.url == "/api/snoemed/getSnoeMedTableData" && actualToken == snomedToken) {
          next();
          return;
        }


        // use jwtwebtoken to validate token
        var jwt = require('jsonwebtoken');
        // secret value is ‘fhir430’
        jwt.verify(actualToken, 'fhir430', function(err, decoded) {
          if (err) {
            return res.status(401).send('Unauthorized');
          } else {
            //token is validated
            //store user session by extracting from JWT token

            req.session.user = decoded;
            var splitUrl = req.url.split("/");
            var compareUrl = "/"+splitUrl[1]+"/"+splitUrl[2];
            var currentPermissionOfUrl = urlBindWithService[compareUrl];

            if(typeof decoded.role != "undefined" && decoded.role[0].permissionList != "undefined") {
              var permissionList = decoded.role[0].permissionList;

              if(Array.isArray(currentPermissionOfUrl) && findUrlIndex(permissionList,currentPermissionOfUrl) != -1) {
                // forwarding request to next level
                next();
              } else {
                return res.status(403).send("Forbidden");
              }
            } else {
              //send you do not have a role.
               return res.status(403).send("Forbidden");
            }
          }
        });
      }
    } else {
      // if request url is not from restricted url then forwarding request to next level
      next();
    }
  });

  // Insert routes below
  app.use('/api/dashboard', require('./api/Dashboard'));


  app.use('/api/register', require('./api/Register'));


  app.use('/api/role',require('./api/Role'));
  app.use('/api/permission',require('./api/Permission'));
  app.use('/api/user',require('./api/User'));
  app.use('/api/createuser',require('./api/CreateUser'));


  app.use('/api/build-questions-set', require('./api/Build_Questions_Set'));
  app.use('/api/build-questions', require('./api/Build_Questions'));
  app.use('/api/practice-test', require('./api/Practice_Test'));

  app.use('/api/RISK', require('./api/RISK_CALCULATOR'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  /*app.route('/*')
   .get(function(req, res) {
   console.log(path.resolve(app.get('appPath') + '/index.html'))
   res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
   });*/
};
function findUrlIndex(objectArray,normalArray) {
   for(var x=0 ; x<objectArray.length ; x++) {
      for(var j=0;j<normalArray.length;j++) {
        if(objectArray[x].permissionUrl == normalArray[j]) {
          return 1;
        }
      }
   }
   return -1;
}
