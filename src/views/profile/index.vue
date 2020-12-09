<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity :user="user" />
              </el-tab-pane>
              <!--<el-tab-pane label="Timeline" name="timeline">-->
                <!--<timeline />-->
              <!--</el-tab-pane>-->
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
//import Account from './components/Account'
import Account from '@/views/usermanagement/index'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'userAccount'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      console.log("getUser avatar",this.avatar);
      console.log("getUser name",this.name);
      console.log("getUser userAccount",this.userAccount);
      this.user = {
        name: this.userAccount,
        role: this.name,
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
