// Shim to prevent libraries from trying to polyfill fetch in the browser
// and causing "Cannot set property fetch of #<Window> which has only a getter"

const fetchShim = window.fetch.bind(window);
const Headers = window.Headers;
const Request = window.Request;
const Response = window.Response;
const FormData = window.FormData;
const Blob = window.Blob;
const File = window.File;

export { fetchShim as fetch, fetchShim as default, Headers, Request, Response, FormData, Blob, File };
