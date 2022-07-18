export function checkConsole(errorMessage, List) {
  if (List.length == 0 && errorMessage.length == 0) {
    alert('You need to run an operation first')
  } else if (errorMessage.length == 0) {
    console.log(List)
  } else {
    errorMessage.map((error, index) => {
      console.log(`Error Message #${index + 1}`, error.ReqResponse[0])
    })
  }
}