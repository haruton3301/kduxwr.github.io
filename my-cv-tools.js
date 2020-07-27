class MyCVTools {
    constructor(rgb) {
        this.rgb = rgb;
        this.gray = new cv.Mat();
        this.result = new cv.Mat(); //処理結果格納用の変数
        cv.cvtColor(rgb, this.gray, cv.COLOR_RGBA2GRAY, 0);
    }

    binarize() {
        cv.adaptiveThreshold(this.gray, this.gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 39, 2)
        cv.bitwise_not(this.gray, this.gray);
        cv.threshold(this.gray, this.gray, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    }

    findContours() {
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(this.gray, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let foundContour = null;
        for (let i = 0; i < contours.size(); i++) {
            // ある程度の面積が有るものだけに絞る
            var cnt = contours.get(i);
            var a = cv.contourArea(cnt, false);

            //輪郭を直線近似する
            var approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.01 * cv.arcLength(cnt, true), true);
            //console.log(approx.size());
            // 矩形のみ取得
            if (approx.size().height == 4 && a > maxArea) {
                maxArea = a;
                foundContour = approx;
                var color = new cv.Scalar(255, 0, 0);
                //cv.drawContours(mat, contours, i, color);
            }
        }

        contours.delete();
        hierarchy.delete();
        approx.delete();

        return foundContour;
    }

    trimMaxRect() { //参考：https://stackoverflow.com/questions/60021855/opencv-js-to-detect-rectangular-shape-from-image-and-cut-it
        let foundContour = this.findContours();

        if (foundContour != null) {

            let corner1 = new cv.Point(foundContour.data32S[0], foundContour.data32S[1]);
            let corner2 = new cv.Point(foundContour.data32S[2], foundContour.data32S[3]);
            let corner3 = new cv.Point(foundContour.data32S[4], foundContour.data32S[5]);
            let corner4 = new cv.Point(foundContour.data32S[6], foundContour.data32S[7]);

            let cornerArray = [{ corner: corner1 }, { corner: corner2 }, { corner: corner3 }, { corner: corner4 }];
            //Sort by Y position (to get top-down)
            cornerArray.sort((item1, item2) => { return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0; }).slice(0, 5);

            //Determine left/right based on x position of top and bottom 2
            let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
            let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
            let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
            let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];

            //Calculate the max width/height
            let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
            let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
            let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
            let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
            let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
            let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;

            //Transform!
            let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
            let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
            let dsize = new cv.Size(theWidth, theHeight);
            let M = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
            cv.warpPerspective(this.rgb, this.result, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        }
    }

    getResult() {
        return this.result;
    }

    endProcess() {
        this.rgb.delete();
        this.gray.delete();
        this.result.delete();
    }
}