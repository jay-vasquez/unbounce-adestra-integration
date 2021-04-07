import MessageFocus from '../../app/MessageFocus.js'

export default async (req, res) => {
    let messageFocus = new MessageFocus();
    let response = await messageFocus.start(req) 

    res.statusCode = 200
    res.json({ response: response })
  }