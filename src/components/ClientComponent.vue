<template>
  <b-container>
    <b-row class="text-center m-4">
      <b-col cols="12">
        <h2>List of clients</h2>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-table
            :busy="loading"
            :bordered="true"
            :hover="true"
            :items="clients"
            :fields="fields"
            :responsive="true"
        >

          <template #thead-top>
            <b-tr>
              <b-th variant="secondary" colspan="5">
                <div class="table-head">
                  <span>Clients (total: {{ clients.length }})</span>
                  <b-button
                      variant="primary"
                      @click="toggleAddModal"
                  >
                    New Client
                  </b-button>
                </div>
              </b-th>
            </b-tr>
          </template>

          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="m-2">Loading...</strong>
            </div>
          </template>

          <template #cell(providers)="data">
            {{ getProvidersNames(data.item.providers) }}
          </template>

          <template #cell(actions)="data">
            <div class="actions">
              <b-icon-pencil-square
                  :variant="'success'"
                  :scale="1.2"
                  class="action-icon"
                  title="Edit"
                  @click="()=>toggleEditModal(data.item._id)"
              />
              <b-icon-trash-fill
                  :variant="'danger'"
                  :scale="1.2"
                  class="action-icon"
                  title="Delete"
                  @click="()=>onRemove(data.item._id)"
              />
            </div>
          </template>
        </b-table>

      </b-col>
    </b-row>


    <modal-component
        v-if="showAddModal"
        mode="add"
        @cancel="toggleAddModal"
        @submit="createClient"
    />

    <modal-component
        v-if="showEditModal"
        mode="edit"
        @cancel="toggleEditModal"
        @submit="editClient"
    />
  </b-container>

</template>

<script>
import {snackbarEmitter} from '@/shared/snackbarEmitter';
import ModalComponent from "./ModalComponent";
import { HttpClientService } from "@/services/http-client.service";

export default {
  name: 'ClientComponent',
  components: {
    ModalComponent,
  },
  data() {
    return {
      fields: ['name', 'email', 'phone', 'providers', 'actions'],
      clients: [],
      loading: true,
      showAddModal: this.$route.query.modal === 'add',
      showEditModal: this.$route.query.modal === 'edit' && this.$route.query.client
    };
  },
  methods: {
    getProvidersNames(providers) {
      return providers.map(({name}) => name).join(', ');
    },

    async onRemove(clientId) {
      try{
        await HttpClientService.delete(`client/${clientId}`);
        this.clients = this.clients.filter(({_id}) => _id !== clientId);
        snackbarEmitter.success('Client removed successfully!');
      }catch (err){
        snackbarEmitter.error(err);
      }

    },

    toggleAddModal() {
      const path = this.showAddModal ? '/' : `?modal=add`;
      this.$router.push(path);
      this.showAddModal = !this.showAddModal;

    },

    toggleEditModal(clientId = null) {
      const path = clientId ? `?modal=edit&client=${clientId}` : '/';
      this.$router.push(path);
      this.showEditModal = !this.showEditModal;
    },

    async createClient(data) {
      try{
        const response  =  await HttpClientService.post('client', data);
        this.clients.push(response.data);
        this.toggleAddModal();
        snackbarEmitter.success('Client created successfully!');
      } catch(err){
        snackbarEmitter.error(err)
      }
    },

    async editClient(data, clientId) {
      try{
        const response  =  await HttpClientService.put(`client/${clientId}`, data);
        const index = this.clients.findIndex(({_id}) => _id === clientId);
        this.$set(this.clients,index,response.data);
        this.toggleEditModal();
        snackbarEmitter.success('Client edited successfully!');
      }catch (err){
        snackbarEmitter.error(err);
      }
    }
  },
  async created() {
    try {
      this.loading = true;
      const response = await HttpClientService.get('client')
      this.clients = response.data;
    }catch (err){
      snackbarEmitter.error(err)
    }finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped lang="css">
.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-head span {
  font-size: 20px;
  font-weight: 800;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-icon {
  margin: 4px 7px;
}

.action-icon:hover {
  cursor: pointer;
}
</style>
