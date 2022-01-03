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
        let body = JSON.parse(req['data.json']);
        let newContact = await this.createContact(body);
        await this.addList(newContact, body);
        if (body.subscribe !== undefined) {
            await this.subscribeToNewsLetter(newContact, body);
        }
        let response = await this.sendSingle(newContact, body);
        return response;
    }

    async createContact(body) {
        let response = null;
        try{
            response = await this.instance.post(`/contacts`, {
                table_id: parseInt(body.table_id[0]),
                contact_data: {
                    email: body.email[0],
                    first_name: body.first_name[0],
                    last_name: body.last_name[0],
                }
            })
        } catch (err) {
            response = { data: err.response.data }
        }

        return response.data;
    }

    async addList(contact, body) {
        let response = null;
        try {
            response = await this.instance.post(`/contacts/${contact.id}/lists/${body.list_id[0]}`)
        } catch (err) {
            response = { data: err.response.data };
        }

        return response.data;
    }

    async subscribeToNewsLetter(contact, body) {
        let response = null;
        try {
            response = await this.instance.post(`/contacts/${contact.id}/lists/${body.subscribe_master_list_id[0]}`);
        } catch (err) {
            response = { data: err.response.data };
        }

        return response.data;
    }

    async sendSingle(contact, body) {
        let response = null;
        try{
            response = await this.instance.post(`/campaigns/${body.campaign_id[0]}/send_single`, {
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