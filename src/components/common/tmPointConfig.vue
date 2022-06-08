<template>
    <!-- <svg :style="`left:${currentPos.x}px;top:${currentPos.y}px;height: ${iconScale !== 1 ? '30px' : '20px'}`" -->
    <!-- <svg  :style="`left:${currentPos.x}px;top:${currentPos.y}px;height: ${iconScale !== 1 ? '30px' : '20px'}`" -->
        
    <div
        v-if="isDrag"
        :style="
            `left:${currentPos.x}px;top:${currentPos.y}px;`  
        "
         @mousedown="dragPosition"
         @mouseup="isDraging = false" class="pointConfigContainer">
       
        <slot></slot>
    </div>
    
</template>

<script>

export default {
    name: 'tm',
    data() {
        return {
            currentPos: { x : 0, y : 0 }          
        };
    },
    computed: {
       
    },
    props: {
       isDrag : {
           type : Boolean,
           default : false
       },
       currentGraph : {
           type : Object,
           default : () => ({})
       }
    },

    watch : {
        currentGraph : {
            handler(v){
                console.error( 'change: ', v ) ;
                this.currentPos = {
                    x : v.pointX,
                    y : v.pointY,
                }
            },
            deep : true
        }
    },
    
    methods: {
        resetInfo(){
            // this.currentPos = { x : this.currentGraph.pointX, y : this.currentGraph.pointY } ;
        },
        
        getPos(e) {//这是一个 获取鼠标位置的函数
            let oEvent = e || event;
            return {
                x: oEvent.clientX + document.documentElement.scrollLeft || document.body.scrollLeft,
                y: oEvent.clientY + document.documentElement.scrollTop || document.body.scrollTop
            };
        },
        dragPosition(e) {
            if (!this.isDrag) {
                return false;
            }
            let self = this;
            let oEvent = e || event;
            // let rootNode = document.body;
            let rootNode = this.$el.parentNode;
            let oldPos = this.getPos(oEvent);
            oldPos = {
                x: oldPos.x - this.currentPos.x,
                y: oldPos.y - this.currentPos.y
            };
            let boundPos = rootNode.getBoundingClientRect() ;
            // oldPos = {
            //     x: oEvent.clientX - boundPos.x,
            //     y: oEvent.clientY - boundPos.y,
            //     ex : oEvent.offsetX,
            //     ey : oEvent.offsetY
            // };
            this.isDraging = true;

            rootNode.onmousemove = function (e) {
                let oEvent = e || event;
                let dpos = self.getPos(oEvent);
               

                // 转百分比坐标
                // let dpos = {
                //     x : oEvent.clientX,
                //     y : oEvent.clientY
                // };
                // self.currentPos.x = ( ( dpos.x - boundPos.x - oldPos.ex ) / self.parentNodeWidth * 100 ) ;
                // self.currentPos.y = ((dpos.y - boundPos.y - oldPos.ey ) / self.parentNodeHeight * 100) ;

                let x = dpos.x - oldPos.x < 0 ? 0 : dpos.x - oldPos.x ;
                let y = dpos.y - oldPos.y < 0 ? 0 : dpos.y - oldPos.y ;
                
                self.currentPos.x = x;
                self.currentPos.y = y;
                
            };
            rootNode.onmouseup = function (e) { 
                self.$emit( 'setPointConfig', self.currentPos ) ;
                rootNode.onmousemove = null;
                rootNode.onmouseup = null;
            };
            return false ;
        },
        
    },
    mounted() {
        
    }
};
</script>
<style scoped>
.pointConfigContainer {
    position: absolute;
    
    background:transparent;
    cursor: pointer;
}
</style>
