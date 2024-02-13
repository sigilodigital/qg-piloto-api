// ------------------------------------------------------------------------------------------------
// PLACE YOUR API ACCESS TOKEN BELOW
const accessToken = 'IAX8tw02tE2GpPL6jiw5Oyp67EDuNcQhZo86b8qtfOz5i6UD8LbX1x9Ca0FLlq7BuGHzFNbq6hsO46qgT3EOw8aPfDrLSH7osAvzw_NtLoJs22_71N0bhU_d_drb50JSxcW8sjPjH4vbgECC2LV26-NRbF2yG4fUJZ3Dpz3zRIQRukZWpWQVaGPr-W3zqGQXLuj2d8_9EHJL4-2tKkQUL7OFvvs-hzSuMMK4yIyhZoOAhU8CJKNQ8kECJjYK_-HqbARi7LOfsXjf_PvMvWUG3olHpPwHtfZmbMlLJQLgGtBS3nFB9zZ9sqp41-9yeinkEyl-JTlIrDL2EMr5L7gLWXB4m06TmMPaXSbjlG6DS2DY9lhLVJf8VB4cd1NX78xbLN7HYDKWavyAyPU4ItnBbaCFw65SPq-_GchxTTCyXZH8Cx9za1pxM24bfEkS05KQh88kPDCtiAWoDAZ5Me46IspNwys4sV3JsmLkYXv65OJmPHMfy1ofKwhIwPUlrc0GhagpTw';
//                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ------------------------------------------------------------------------------------------------

const restPkiUrl = 'https://pki.rest/';

// Throw exception if token is not set (this check is here just for the sake of newcomers, you can remove it)
if (!accessToken || accessToken.indexOf(' API ') >= 0) {
    throw 'The API access token was not set! Hint: to run this sample you must generate an API access token on the REST PKI website and paste it on the file routes/pades-signature.js';
}

export const client = {
    accessToken: accessToken,
    endpoint: restPkiUrl
};