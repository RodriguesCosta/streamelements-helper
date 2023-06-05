export function getCookies(cookies:string) {
  const cookiesArray = cookies.split(';')
  const cookiesObject = cookiesArray.reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key.trim()] = value.trim()
    return acc
  }, {} as { [key: string]: string })
  return cookiesObject
}