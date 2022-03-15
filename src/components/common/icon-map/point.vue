<template>
    <el-tooltip :style="'position:absolute;left:'+(item[x])+'px;top:'+(item[y])+'px'" class="item"
                effect="dark" placement="bottom-start">
        <div slot="content" v-html="tip(item)"></div>

        <div class="point-container-body" @mousedown="move" :style="''+(editMode ? 'cursor:move':'')">
            <div style="pointer-events: none;position: relative;">
                <table cellspacing=0>
                    <tr>
                        <td colspan="2" style="text-indent: 1em;">
                            {{item.ccsPointName}}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align:top">
                            <img align="left" :src="item[icon] ? item[icon] : def" class="point"></td>
                        <td v-html="text(item)" style="text-indent: 1em;"></td>
                    </tr>
                </table>

            </div>

        </div>

    </el-tooltip>

</template>
<script>
export default {
    model: {
        prop: 'item',
        event: 'change'
    },
    props: {
        item: Object,
        text: Function,
        tip: Function,
        editMode: Boolean,
        x: {
            type: String,
            default: 'x'
        },
        y: {
            type: String,
            default: 'y'
        },
        icon: {
            type: String,
            default: 'icon'
        },
        divWidth: {
            type: Number,
            default: 0,
        },
        divHeight: {
            type: Number,
            default: 0,
        }
    },
    components: {},
    watch: {
        // fullscreen:function(n,o){

        // }
    },
    data() {
        return {
            pointWidth: 0,
            pointHeight: 0,
            def: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAABINJREFUWEftlr9vI0UUxz+79jq24/gujsI5Ef0VFxo4nUiDUiAutChNJNAVx39wgoqGCsorTkFWRHFINEhBQgiJfwAhohApIhelSHOKCYdyF/+Isb3jnV2K3bc79jqJDxoKvtKT1zPjzGfffN+8wH9A1ujAFTLXm8+B8Tzu+6WyRwfGyGq1WnODweBt13U/6Pf77zWbzdurq6sOkBkJmxBO4t9LKbXsed6PWutBMCLP807Oz88/29jYeAUoAHlgChA4E+jlFQSBo7XeMDft9/tBp9MJut1u4HlePD4YDP7c399fBcpACSgyHuZCpSaDIHB83//etu27Wuug0WhYrVYLrfXQukKhwNzcHMViEa21d3h4+OHS0tIPgAa8KHQUgREppTzh+/5D27bvKqU4Pj62zs7OUgAAvV6Per3O8+fPyWQy2Zs3b37x+PHjNwiPZgrIAVnCbFzqk6FBpdSbjuP87HleUK/XLaWUOX2h5ufnmZ2dpd1u78zPz7+vlOoDfcAFFElWfMZkYygTmUzmE4BWqzUxAMCLFy/QWlMul2/XarW3gGlCb+QJMyLeGOuPGKLRaFwH3gFoNpvxgknk+z7tdhuAO3fuvEtiUIEQk449khiiVCq9btu20+/3/XEeuErdbheAarX6GiFAIYpxlTIEko0+LcuyFgE8z0uRTiLP8wDI5/NzhBmQylBRZKLvfvSTWHEmtNYKwLL+EUP8Oy+kyZFUiFklYzMRQ7iu+zuA4zgp904ix3EA6HQ6Z4Tpd0j8MA4iBokhNjc3d7XWrVwuZ+dyORmeWNPT0wA8efLkgJfsKTHEgwcPPKXUFkClUklWTKBsNsvMzAxa66BWq/1CuJGU5IWlKYohALa3tz/XWrvlcjl+s6tkWRbVahXLstjb2/tpa2vrj9E1V8mECFZWVuqnp6cfAVSr1WBmZsaYTsu2bRYXFykWizQajdN79+59Q3Ir+iNxodekREXBwsLCV8+ePXv1xo0bHy8sLHDt2jWazSa9Xg+tNZZl4TgOpVKJ2dlZMpkM7Xb77P79+w/39/dbhBtKAzMbmQkzBCTnJGeYJXR0fnd3d/3WrVuf5nK567I4CIJUCR8dHf22vr7+5c7OTpNwQ0XYN/4COkAbOAe60bgJBYTOhWEYC7BrtdrR9vb2t0tLS24+n69MTU1VbNu2AFzX7R0eHv766NGjr9fW1r47OTnpEf7xAQlELwrZXBqZZCSW+VoWSUnlCG+9acI+UKpUKuXl5eXq06dP9cHBwcD3fXG8nL8mhBCALmEmOtGzG82nPDIKISBZwhuvQNgHJAokt6A0JEh8YGahS3gkAqAY/icnlmlMmTDfSjaRt/VIruNRCDkKl+QoLj0G0Wh1wPCG5piAuQx3RXO9NCs3ChX9RiBSlQFpCDMbpiQ7iqQXmLegzIs5JaREL8wCpCEgDWJePBmStmwa0zSnwMizCZDKAgwbc1RiVIt0H5AQjYLIxjIma8bqMghI5k0YE05kZk+AzLhUV0GIRmHMMUg2uujzUk0KIZpk/UQb/69x+huLVyABHs7jMAAAAABJRU5ErkJggg=='
        };
    },
    methods: {
        preventDrag(e) {
            // e.preventDefault()
            // e.stopPropagation();
        },
        move(e) {
            // console.log('drag',this.editMode)
            if (!this.editMode) return;

            // console.log(e.target);
            let odiv = e.target;

            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {       //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let x = e.clientX - disX;
                let y = e.clientY - disY;
                let tempItem = Object.assign({}, this.item);
                tempItem[this.x] = x;
                tempItem[this.y] = y;

                this.$emit('change', tempItem);
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    },
    mounted() {
        // console.log(this.item)
    },
};
</script>

<style scoped>
    .point {
        position: absolute;
        top: -10px;
        left: -10px;
    }
</style>
