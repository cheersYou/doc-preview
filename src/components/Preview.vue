<!--
 * @Author: weicong
 * @Date: 2021-03-10 10:30:01
 * @LastEditTime: 2021-03-10 11:37:02
 * @LastEditors: weicong
 * @Description: 
-->
<template>
  <div class="preview">
    <div class='preview-header'>
      <Button @click="exportExcel">导出Excel</Button>
      <Button @click="exportImage">导出图片</Button>
      <Button @click="exportPDF">导出PDF</Button>
    </div>
    <div ref="preview">
        <Table :columns="columnsData" :data="rowsData"></Table>
    </div>
  
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
export default {
  name: "Preview",
  data() {
    return {
      downloadLoading: false,
      exportName: "文件",
      columnsData: [
           {
            title: 'Name',
            key: 'name'
          },
          {
              title: 'Age',
              key: 'age'
          },
          {
              title: 'Address',
              key: 'address'
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
          filename: this.exportName,
          autoWidth: true,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    exportImage() {
    const dom = this.$refs.preview;
    html2canvas(dom, {
        backgroundColor: "#ffffff"
      }).then(canvas => {
        // 地图需要使用html2canvas在转，然后绘制到dom上
        let dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = this.exportName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })

    },
    exportPDF() {
      const dom = this.$refs.preview;
      html2canvas(dom, {
        backgroundColor: "#ffffff"
      }).then(canvas => {
        // 地图需要使用html2canvas在转，然后使用img标签绘制到dom上
        let dataUrl = canvas.toDataURL("image/png");
        pdfMake.vfs = pdfFonts;
        let docDefinition = {
          pageOrientation: "landscape",
          background: [
            {
              image: dataUrl,
              width: 436.3,
              height: 450,
              alignment: "center",
              margin: [0, 60, 0, 0]
            }
          ]
        };
        pdfMake.createPdf(docDefinition).download(this.exportName);
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

// <style scoped lang='scss'>
// .preview{
//   width:100%;
//   height:100%;
//   &-header{
//     height:3rem
//   }
//   &-content{
//     height:calc(100% - 3rem);
//   }
// }
// </style>