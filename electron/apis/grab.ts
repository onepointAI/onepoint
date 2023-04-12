const apiKey = 'ak-qdtjz-fks5w-bknam-y05vq-kmnvx' //leave undefined to use a demo key.  get a free key at https://Dashboard.PhantomJsCloud.com

export default async (req: any, res: any) => {
  const apiHost = `https://PhantomJScloud.com/api/browser/v2`
  try {
    const response = await fetch(`${apiHost}/${apiKey}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        renderType: 'plainText',
        url: 'https://juejin.cn/post/7218109174084534330',
      }),
    })

    const resp = await response.text()
    res.send({
      code: 0,
      result: resp,
    })
  } catch (e) {
    res.send({
      code: -1,
      result: e,
    })
  }
}
