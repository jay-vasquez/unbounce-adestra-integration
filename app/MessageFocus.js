import axios from 'axios';
const instance = null;

class MessageFocus{
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.API_ENDPOINT,
            headers: {
                'Authorization': `TOKEN ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        })
    }

    async start(req) {
        // let newContact = await this.createContact(req);
        // await this.addList(newContact);
        // let response = await this.sendSingle(newContact);
        // return response;

        return 'OK';
    }

    async createContact(body) {
        let response = null;
        try{
            response = await this.instance.post(`/contacts`, {
                table_id: parseInt(process.env.ADESTRA_TABLE_ID),
                contact_data: {
                    email: `john.joseph.vasquez@rhythmagency.com`,
                    first_name: 'Jayjay',
                    last_name: 'Vasquez',
                    title: 'Dev',
                }
            })
        } catch (err) {
            response = { data: err.response.data }
        }

        return response.data;
    }

    async addList(contact) {
        let response = null;
        try{
            response = await this.instance.post(`/contacts/${contact.id}/lists/${process.env.ADESTRA_LIST_ID}`)
        } catch (error) {
            response = { data: err.response.data };
        }

        return response.data;
    }

    async sendSingle(contact) {
        let response = null;
        try{
            response = await this.instance.post(`/campaigns/${process.env.ADESTRA_CAMPAIGN_ID}/send_single`, {
                send_single_contact: contact.id,
                send_single_options: {
                    suppression_info: true
                }
            })
        } catch(err) {
            response = { data: err.response.data };
        }

        return response.data;
    }
}

export default MessageFocus