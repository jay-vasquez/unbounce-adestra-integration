import MessageFocus from '../../app/MessageFocus.js'
import formidable from 'formidable';

export default async (req, res) => {
  const form = formidable ({multiples: true})
  let messageFocus = new MessageFocus();
  await form.parse(req, async (err, fields, files) => {
    if (err) {
      return err;
    }
    let response = await messageFocus.start(fields)

    res.statusCode = 200
    res.json({ data: response })
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};