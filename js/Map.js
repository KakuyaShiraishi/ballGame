/**
 * Created by Shiraishi Kakuya on 30/12/2016.
 */


function Map(){
    this.mapDimensionsTest=[];
    this.texts=[];
    this.checkpoints=[];


}

Map.prototype.sortPolys=function(){
    for(var i=0;i<this.mapDimensionsTest.length;i++){
        this.mapDimensionsTest[i]=bubbleSort(this.mapDimensionsTest[i]);
    }
};

function bubbleSort(items){

    var len = items.length,
        i, j, stop;

    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop-1; j++){
            if (items[j][0].x > items[j+1][0].x){
                swap(items, j, j+1);
            }
        }
    }

    return items;
}

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

Map.prototype.loadMap=function(_dataMap){



    //OBJETOS
    for(var layerId=0;layerId<_dataMap.layers.length;layerId++) {
        var layerData=_dataMap.layers[layerId];

        if (layerData.name == "Textos") {
            for(var oId=0;oId<layerData.objects.length;oId++) {
                var o=layerData.objects[oId];
                this.texts.push(new TextCanvas(o.name, new Vector2D(o.x, o.y),new Vector2D(o.width, o.height), o.properties.time));
            }

            _dataMap.layers.splice(layerId,1);
            layerId-=1;

        }else if (layerData.name == "Checkpoints") {
            for(var oId=0;oId<layerData.objects.length;oId++) {
                var o=layerData.objects[oId];
                this.checkpoints.push(new Vector2D(o.x, o.y));
            }

            _dataMap.layers.splice(layerId,1);

        }


    }
    //FIN TEXTOS


    for(var layerId=0;layerId<_dataMap.layers.length;layerId++){
        this.mapDimensionsTest[layerId]=[];
        var layerData=_dataMap.layers[layerId];





        for(var objectId=0;objectId<layerData.objects.length;objectId++){




            var objectData=layerData.objects[objectId];




            var lastPos=new Vector2D(objectData.x+objectData.polyline[0].x,objectData.y+objectData.polyline[0].y);
            for(var polyLineId=1;polyLineId<objectData.polyline.length;polyLineId++){

                var xLine=objectData.polyline[polyLineId].x+objectData.x;
                var yLine=objectData.polyline[polyLineId].y+objectData.y;
                var newPos=new Vector2D(xLine,yLine);

                this.mapDimensionsTest[layerId].push([lastPos.clone(),newPos.clone()]);

                lastPos=newPos;


            }


        }


    }
    //this.sortPolys();

    //console.log(JSON.stringify(this.mapDimensionsTest));
};

