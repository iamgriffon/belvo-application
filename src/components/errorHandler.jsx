export function ErrorHandler(props) {
  const errorMessage = props.errorMessage;
  return (
    <>
      <h3> - ERROR HANDLER - </h3>
      {
        errorMessage.map((error, index) => (
          <div key={index}>
            {error.ReqResponse.map((response, idx) => (
              <div key={idx}>
                <h3>Case: {error.reason}</h3>
                {response.message && <p>Error Message: <strong>{response.message}</strong></p>}
                {response.field && <p>Field error: <strong>{response.field}</strong></p>}
                {response.code && <p>Error reason code: <strong>{response.code}</strong></p>}
                {response.request_id && <p>Request ID: <strong>{response.request_id}</strong></p>}
                <p> ------------------------------------------</p>
              </div>
            ))}
            {error.ReqBody ? (<p>Request body: <strong>{JSON.stringify(error.ReqBody)}</strong></p>) : <p>No Request Body for this API CALL</p>}
            <p> ------------------------------------------</p>
          </div>
        ))
      }
    </>
  )
}