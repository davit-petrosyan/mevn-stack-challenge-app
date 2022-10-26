<template>
  <b-modal
      size="lg"
      :visible="true"
      :centered="true"
      @close="closeModal"
      @hide="closeModal"
  >
    <template #modal-header>
      <h5>{{ title[mode] }}</h5>
    </template>

    <template #modal-footer="{ cancel}">
      <b-button size="sm" variant="outline-danger" @click="cancel()">
        Cancel
      </b-button>
      <b-button size="sm" variant="outline-success" @click="onSubmit">
        Save
      </b-button>
    </template>

    <b-container>
      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'name-input'">Name:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="text"
              name="name"
              v-model="client.name"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'email-input'">Email:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="email"
              name="email"
              v-model="client.email"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'phone-input'">Phone:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="text"
              name="phone"
              v-model="client.phone"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" md="2" lg="2" class="text-right">
          <label :for="'new-provider-input'">Providers:</label>
        </b-col>
        <b-col sm="6" md="6" lg="7">
          <b-form-input
              type="text"
              v-model="newProvider"
          />
        </b-col>
        <b-col sm="4" md="4" lg="3">
          <b-button
              class="add-provider-button"
              variant="primary"
              @click="addNewProvider"
          >
            Add Provider
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="allProviders.length">
        <b-col sm="7" offset-sm="2">
          <div class="border rounded p-3 providers-container">
            <provider-component
                v-for="provider in allProviders"
                :key="provider._id"
                :info="provider"
                :selected="selectedProviders.has(provider._id)"
                @select="onSelectProvider"
                @remove="onRemoveProvider"
                @edit="onEditProvider"
            />
          </div>
        </b-col>

      </b-row>
    </b-container>

  </b-modal>
</template>

<script>
import providerComponent from './ProviderComponent';
import {snackbarEmitter} from '@/shared/snackbarEmitter';
import {HttpClientService} from "@/services/http-client.service";

export default {
  name: 'ModalComponent',
  components: {
    providerComponent
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator: (val) => ['add', 'edit'].includes(val)
    }
  },
  data() {
    return {
      title: {
        add: 'Create new client',
        edit: 'Edit client'
      },
      allProviders: [],
      selectedProviders: new Set(),
      newProvider: '',
      client: {
        _id: null,
        name: '',
        email: '',
        phone: '',
      }
    };
  },

  methods: {
    closeModal(event) {
      event.preventDefault();
      this.$emit('cancel');
    },

    onSelectProvider(providerId) {
      const selectedProviders = new Set(this.selectedProviders);
      if (selectedProviders.has(providerId)) {
        selectedProviders.delete(providerId);
      }
      else {
        selectedProviders.add(providerId);
      }
      this.selectedProviders = selectedProviders;
    },

    async addNewProvider() {
      const newProvider = this.newProvider.trim();
      if (!newProvider) {
        return;
      }
      try{
        const response = await HttpClientService.post('provider', {name: newProvider});
        this.allProviders.push(response.data);
        this.newProvider = '';
        snackbarEmitter.success('Provider created successfully!');
      }catch(err) {
        snackbarEmitter.error(err);
      }
    },

    async onRemoveProvider(providerId) {
      try{
        await HttpClientService.delete(`provider/${providerId}`);
        this.allProviders = this.allProviders.filter(({_id}) => _id !== providerId);
        snackbarEmitter.success('Provider removed successfully!');
      }catch(err){
        snackbarEmitter.error(err);
      }
    },

    async onEditProvider(data) {
      try{
        const response = await HttpClientService.put(`provider/${data._id}`, data);
        const index = this.allProviders.findIndex(({_id}) => _id === data._id);
        this.$set(this.allProviders,index,response.data);
        snackbarEmitter.success('Provider edited successfully!');
      }catch (err) {
        snackbarEmitter.error(err);
      }
    },

    onSubmit() {
      const client = {
        ...this.client,
        providers: [...this.selectedProviders]
      };

      this.$emit('submit', client, this.client._id);
    }
  },
  async created() {
    const clientId = this.$route.query.client;
    if (clientId && this.mode === 'edit') {
      try{
        const response = await HttpClientService.get(`client/${clientId}`);
        const client = response.data;
        this.client = client;
        this.selectedProviders = new Set(client.providers.map(({_id}) => _id));
      }catch (err){
        snackbarEmitter.error(err);
      }
    }

    try{
      const response = await HttpClientService.get('provider')
      this.allProviders = response.data;
    }catch (err){
      snackbarEmitter.error(err);
    }

  }
}
</script>

<style scoped lang="css">
.add-provider-button {
  width: 100%;
}

.providers-container {
  max-height: 20vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
