<template>
	<f7-page @page:reinit="load" style = "background-color: ghostwhite;">
	    <f7-navbar title="数据查看" :back-link="lastPage">
	    </f7-navbar>
	<!-- @click="changeType" -->
	    <f7-toolbar style = "background-color: white;">
	      <f7-link  class="toolbar-category" @click="changeType" style = "color: #000000;" >公司</f7-link>
	      <f7-link  class="toolbar-category" @click="changeType" style = "color: #000000;" >部门</f7-link>
	      <f7-link  class="toolbar-category" @click="changeType" style = "color: #000000;" >员工</f7-link>
		  <f7-link  class="toolbar-category" @click="changeType" style = "color: #000000;" >汇报列表</f7-link>
	    </f7-toolbar>
		
		<f7-list style = "background-color: white;margin-top: 10px;margin-bottom: 0px;border-top:0.5px solid #CCCCCC;border-bottom:0.5px solid #CCCCCC">
				<f7-link style = "color: #000000;width: 40%;height: 45px;border-right:0.5px solid #CCCCCC">
					<span>近一周</span>
					<div style="width: 15px;height: 15px;position: absolute;background-color: #CCCCCC;right:30px"></div>
				</f7-link>
				<f7-link style = "color: #000000;width: 60%;height: 45px;">
					<span>今天营业额</span>
					<div style="width: 15px;height: 15px;position: absolute;background-color: #CCCCCC;right:30px"></div>
				</f7-link>
		</f7-list>
		
		<f7-list style = "background-color: white;margin-top: 0px;margin-bottom: 10px;">
			<canvas id="myChart2" width="300px" height="200px"></canvas>
		</f7-list>
		
        <f7-list style = "background-color: white;margin-top: 10px;">
					 
        	<f7-list-item title="今日营业额：" after="1234元">
				<div style="width: 10px;height: 10px;background-color: orange;position: absolute;left: 100px;">
				</div>
        	</f7-list-item>
			<f7-list-item title="今日客户数：" after = "123个">
                <div style="width: 10px;height: 10px;background-color: blue;position: absolute;left: 100px;"></div>
        	</f7-list-item>
			<f7-list-item title="今日支出：" after = "230元">
            	<div style="width: 10px;height: 10px;background-color:red;position: absolute;left: 100px;"></div>
        	</f7-list-item>
			<f7-list-item title="今日利润：" after="1110元">
                <div style="width: 10px;height: 10px;background-color: orchid;position: absolute;left: 100px;"></div>	
        	</f7-list-item>
				
        </f7-list> 
	</f7-page>
</template>

<script>
import Chart from 'chart.js';
import { log } from 'util';

	export default {
		components: {

		},
		props: [
        'lastPage',
        'reference'
   		],
		data() {
			return {
				
			};
		},
		
		mounted() {
			// $('select[name="range"]').change(() => {
            // 		this.params.range = $('select[name="range"] option:checked').attr('value');
            // 		this.$f7.popover.close('.smart-select-popover');
        	// 	});
        	// 	$('select[name="status"]').change(() => {
            // 		this.params.status = $('select[name="status"] option:checked').attr('value');
            // 		this.$f7.popover.close('.smart-select-popover');
			// 	});
			this.changeType({target: $('.toolbar-category')[0]});

        	var ctx2 = document.getElementById("myChart2");

        	var myChart2 = new Chart(ctx2, {
            	type: "line",
            	data: {
                	labels: ["12-10", "12-10", "12-10", "12-10", "12-10", "12-10", "12-10", "12-10"],
                	datasets: [
                    	{
												// rgba(225,10,10,0.3)
                        	label: "",
                        	backgroundColor: "rgba(245,166,35,1)",
                        	borderColor: "rgba(245,166,35,1)",
                        	borderWidth: 2,
                        	pointStrokeColor: "#fff",
                        	pointStyle: "crossRot",
                        	data: [65, 59, 0, 71, 56, 10, 40, 22, 32],
                        	cubicInterpolationMode: "monotone",
                        	spanGaps: "false",
                        	fill: "false"
                    	}
                	]
				},
				
        
        
            	options: {
                
            	}

        	});
		},
		load() {
            this.inform();
            this.records = [];
            
            let filters = { 
                category: this.params.category,
                createdAfter: this.getStartTime()
            }
            if (this.params.status != '全部') { filters.status = this.params.status; }

            axios.get('api/application?q=' + JSON.stringify(filters)).then(resp => {
                this.records = resp.data;
                this.inform();
            }).catch(err => {
                console.error(err);
                this.inform('无法获取数据，请稍后再试', '操作失败');
			})
		},
		methods: {
			changeType(ev) {
				console.log(ev)
            	// this.params.category = ev.target.innerText;
            	$('.toolbar-category').css('border-bottom', '');
            	$(ev.target).css('border-bottom', '5px solid #2196f3');
        	},
    	}
		
	}
</script>

	
<style>
.small {
    width: 100%;
    height: 220px;
}
.f7link {
    width: 50%;
    height: 45px;
		color: #000000;
		border-bottom-color: #000000;
		border-width: 1px;
}
.toolbar-categorys{
	background-color: white;
	color: black;
}
</style>
