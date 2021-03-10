<!--
 * @Author: weicong
 * @Date: 2021-03-10 10:30:01
 * @LastEditTime: 2021-03-10 11:02:52
 * @LastEditors: weicong
 * @Description: 
-->
<template>
  <div class="preview">
    <div>
      <Button @click="exportExcel">导出Excel</Button>
      <Button @click="exportImage">导出图片</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
  data() {
    return {
      downloadLoading: false,
      columnsData: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
      ],
      rowsData: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      bookType: "xlsx"
    };
  },
  methods: {
    exportExcel() {
      import("@/plugins/Export2Excel").then(excel => {
        const tHeader = this.cutValue(this.columnsData, "title");
        const filterVal = this.cutValue(this.columnsData, "key");
        const list = this.rowsData;
        const data = this.formatJson(filterVal, list); // 格式化数据
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "本地数据模版",
          autoWidth: true,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    cutValue(target, name) {
      let arr = [];
      target.forEach(val => {
        arr.push(val[name]);
      });
      return arr;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  }
};
</script>
