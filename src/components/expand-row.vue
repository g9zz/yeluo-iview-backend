<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">github：</span>
                <span class="expand-value">{{ row && row.github && row.github.nickname }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">weibo：</span>
            <span class="expand-value">{{ row && row.weibo && row.weibo.name }}</span>
            </Col>
            <Col span="8">
            <span class="expand-key">xcx：</span>
            <span class="expand-value">{{ row && row.xcx && row.xcx.nickName }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
            <span class="expand-key">role：</span>
            <span class="expand-value">{{ row && row.role && row.role[0] && row.role[0].displayName }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>