//انا عايز اعمل ايه 
document.addEventListener('DOMContentLoaded', () => {
    // Hook input listeners
    document.getElementById('lower-bound').addEventListener('input', updateTableAndDraw);
    document.getElementById('upper-bound').addEventListener('input', updateTableAndDraw);
    document.getElementById('partitions').addEventListener('input', updateTableAndDraw);

    // Hook function radio change
    document.querySelectorAll('input[name="function"]').forEach(input => {
        input.addEventListener('change', updateTableAndDraw);
    });

    // Initial draw on load
    updateTableAndDraw();
});
//1 امسك الcanvas بتاعي واجهزه للرسم 

//canvas setup

const canvas = document.getElementById('riemann-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
//هشتغل ازي  sum(xj-xj-1) * inf or sup f(xj)

//انا عايز احسب قيمة الxj و xj-1 قيمة dx الي هزودها 
function updateTableAndDraw(){
    //امسك كل variable اللي عندي
    const a = parseFloat(document.getElementById('lower-bound').value);
    const b = parseFloat(document.getElementById('upper-bound').value);
    //التحويل من string ل int
    const n = parseInt(document.getElementById('partitions').value, 10);
    //اتأكد انهم قيم vaild
    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0||a<0||b<=0) {
        return;
    }
    if(n>=80){
        alert("Please enter a number less than 80 for partitions.");
        return;
    }
    //dx هزود قد ايه 
    const dx = (b - a) / n;
    //امسك الtable بتاعي
    const tableBody = document.getElementById('rieman-table-body');
    //امسح كل ال rows اللي عندي
    tableBody.innerHTML = '';
    // احسب الsum بتاعي
    let lowerSum = 0;
    let upperSum = 0;
    const points = [];
    //احسب القيم بتاعتي
    for (let i = 0; i < n; i++) {
        const x0 = a + i * dx;
        const x1 = x0 + dx;
        const fx0 = f(x0);
        const fx1 = f(x1);
        //الinf و sup
        const inf = Math.min(fx0, fx1);
        const sup = Math.max(fx0, fx1);
        //احسب ال lower sum و upper sum
        lowerSum += dx * inf;
        upperSum += dx* sup;
        //امسك ال row بتاعي
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i }</td>
            <td>${x0.toFixed(2)}</td>
            <td>${x1.toFixed(2)}</td>
            <td>${dx.toFixed(2)}</td>
            <td>${inf.toFixed(3)}</td>
            <td>${sup.toFixed(3)}</td>
        `;
        tableBody.appendChild(row);
        //push points to array 
        points.push({ x0, x1, inf, sup,lowerSum,upperSum });
    }
 
    //عايزين نرسم 
    //هنعمل ازاي هنبعت ال x0 و x1 و inf و sup
    //هعمل function اسمها drawRiemannSum هتستقبل ال points و dx و inf و sup
    document.getElementById('lower-sum').textContent = lowerSum.toFixed(3);
    document.getElementById('upper-sum').textContent = upperSum.toFixed(3);

    drawRiemannSum(points, a,b);
    calcRiemannIntegrable(points,a,b);

}

function f(x) {
    // Define the selected function
    const selectedFunction = document.querySelector('input[name="function"]:checked').value;
    switch (selectedFunction) {
        case 'square':
            return x * x;
        case 'inverse':
            return x !== 0 ? 1 / x : 0;
        default:
            return x;
    }
}
// function calcRiemannIntegrable(points,a,b){
//     // Calculate the Riemann integrable value based on the points and bounds
//     const maxSup = Math.min(...points.map(p => p.upperSum));
//      const minInf = Math.max(...points.map(p => p.lowerSum));
//      const LowerRiemannIntegrable=minInf;
//      const UpperRiemannIntegrable=maxSup;
//      document.getElementById('lower-integrable').textContent = LowerRiemannIntegrable.toFixed(3);
//      document.getElementById('upper-integrable').textContent = UpperRiemannIntegrable.toFixed(3);
// }

function drawRiemannSum(points, a, b) { 
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //determine the space of rectangle 
    const marginLeft = 50;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 40;
    const plotWidth = canvas.width - marginLeft - marginRight;
    const plotHeight = canvas.height - marginTop - marginBottom;

    // Determine scaling factors
    //
    const maxSup = Math.max(...points.map(p => p.sup));
    const scaleX = plotWidth / (b - a);
    const scaleY = plotHeight / maxSup; // Assuming y starts from 0

    // Draw the axes
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // y-axis
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, canvas.height - marginBottom);
    ctx.stroke();
    
    ctx.beginPath();
    // x-axis
    ctx.moveTo(marginLeft, canvas.height - marginBottom);
    ctx.lineTo(canvas.width - marginRight, canvas.height - marginBottom); // X-axis
    ctx.stroke();

    //Draw x-axis 
    const n = points.length; 
    const dx = (b - a) / n;  
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= n; i++) {
        const xVal = a + i * dx;
        const xPos = marginLeft + scaleX * (xVal - a);
        ctx.beginPath();
        ctx.moveTo(xPos, canvas.height - marginBottom);
        ctx.lineTo(xPos, canvas.height - marginBottom + 5); // Tick length
        ctx.stroke();
        //Label
        ctx.fillText(xVal.toFixed(2), xPos, canvas.height - marginBottom + 7); // Label position
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const yVal = (maxSup * i) / yTicks;
        const yPos = canvas.height - marginBottom - yVal * scaleY;
        ctx.beginPath();
        ctx.moveTo(marginLeft - 5, yPos);
        ctx.lineTo(marginLeft, yPos);
        ctx.stroke();
        //Label
        ctx.fillText(yVal.toFixed(2), marginLeft - 7, yPos); // Label position
    }

    // Draw the rectangles for the Riemann sum

    ///Translate the points to canvas coordinates
    //lower Riemann sum
    ctx.fillStyle = '#09c';
    points.forEach(p => {
        const xCanvas = marginLeft + (p.x0 - a) * scaleX;
        const widthCanvas = (p.x1 - p.x0) * scaleX;
        const heightCanvas = p.inf * scaleY;
        ctx.fillRect(xCanvas, canvas.height - marginBottom - heightCanvas, widthCanvas, heightCanvas);
    });

    //Draw upper sum rectangles
    ctx.fillStyle = 'tomato';
    ctx.globalAlpha = 0.5;
    points.forEach(p => {
        const xCanvas = marginLeft + (p.x0 - a) * scaleX;
        const widthCanvas = (p.x1 - p.x0) * scaleX;
        const heightCanvas = p.sup * scaleY;
        ctx.fillRect(xCanvas, canvas.height - marginBottom - heightCanvas, widthCanvas, heightCanvas);
    });
    ctx.globalAlpha = 1.0;
}
