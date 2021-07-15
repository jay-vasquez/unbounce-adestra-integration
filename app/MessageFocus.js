import axios from 'axios';
const instance = null;
const adestra_details = {
    table_id: '',
    campaign_id: '',
    list_id: ''
};

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
        this.adestra_details.table_id = body.table_id[0];
        this.adestra_details.campaign_id = body.campaign_id[0];
        this.adestra_details.list_id = body.list_id[0];
        
        let newContact = await this.createContact(body);
        await this.addList(newContact);
        let response = await this.sendSingle(newContact);
        return response;
    }

    async createContact(body) {
        let response = null;
        try{
            response = await this.instance.post(`/contacts`, {
                table_id: parseInt(this.adestra_details.table_id),
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

    async addList(contact) {
        let response = null;
        try{
            response = await this.instance.post(`/contacts/${contact.id}/lists/${this.adestra_details.list_id}`)
        } catch (err) {
            response = { data: err.response.data };
        }

        return response.data;
    }

    async sendSingle(contact) {
        let response = null;
        try{
            response = await this.instance.post(`/campaigns/${this.adestra_details.campaign_id}/send_single`, {
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