<template>
    <Button type="primary" @click="modal6 = true">显示对话框</Button>
    <Modal
            v-model="modal6"
            title="对话框标题"
            :loading="loading"
            @on-ok="asyncOK">
        <p>点击确定后，对话框将在 2秒 后关闭。</p>
    </Modal>
</template>
<script>
    export default {
        data () {
            return {
                modal6: false,
                loading: true
            }
        },
        methods: {
            asyncOK () {
                setTimeout(() => {
                    this.modal6 = false;
                }, 2000);
            }
        }
    }
</script>
