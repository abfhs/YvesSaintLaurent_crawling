const util = require('util');
const axios = require('axios');
const express = require('express');

const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// GET 요청 처리
app.get('/', async (req, res) => {

    // 1. 상품 정보를 List형태로 저장 
    const result = await getItemList();
    if(result == false){
        console.error('Target page changee:', error);
        res.status(500).send({ error: 'target page change' });
    }

    try {
        // 2. 데이터를 워크북으로 변환, 파일을 메모리에서 생성
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(result); // JSON 데이터를 시트로 변환
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const timestamp = Date.now(); 
        const fileName = `YvesSaintLaurent_${timestamp}.xlsx`; 

        // 4. Buffer로 생성
        const fileBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // 5. 클라이언트에 파일 전송
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(fileBuffer);
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send({ error: 'Failed to generate Excel file' });
    }
});

async function getItemList() {
    /**
     * 타겟 페이지 분석에서 상품 정보가 들어있는 통신을 확인했습니다.
     * Ajax로 요청해서 상품 정보 Object를 받아옵니다.
     * 상품 정보 Object에서 상품명, 상품 Url, 이미지 Url, 가격을 Object형태로 List에 저장해서 반환합니다.
     * 
     * 페이징 처리도 요청하셨기 떄문에 페이지를 반복문으로 호출해서 상품정보가 더이상 나오지 않을 때 break해서 상품정보 List를 return하는 방식으로 만들었습니다.
     */
    try{
        var itemList = [];
        var page = 0
        while(true){

            //Ajax 요청에 필요한 method, url, header를 세팅합니다.  
            let httpRequest = {};
            httpRequest.method = "GET";
            httpRequest.headers = {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=1, i",
                "traceparent": "00-5afbf05a40ae91e3a73be56851b31e51-72dc412b6e0c979e-01",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            };
            httpRequest.url = "https://www.ysl.com/api/v1/category/%EC%97%AC%EC%84%B1,%ED%95%B8%EB%93%9C%EB%B0%B1?locale=ko-kr&page="+page+"&categoryIds=view-all-handbags-women&isEmployeeOnly=false&isEmployee=false&hitsPerPage=15";
            httpRequest.data = ""
        
            resultData = await AxiosConnect(httpRequest);
            if(resultData == false){
                return false;
            }
    
            var productList = resultData.data.products;
    
            if(productList == 0) break; //상품정보가 더이상 없으면 break;
    
            page++;
    
            for(let idx=0; idx<productList.length; idx++){
                var obj = {};
                obj.name = productList[idx].name;
                obj.image = productList[idx].image.src;
                obj.url = "https://www.ysl.com" + productList[idx].url;
                obj.price = productList[idx].price.finalPrice;
    
                itemList.push(obj);
            }
     
        }
    }catch(e){
        console.log(e);
        return false;
    }
   
    return itemList;
    

}

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// Ajax 방식으로 요청
async function AxiosConnect({ method, headers, url, data }) {
    let response, redirectCount = 0;

    try{
        do {
            response = await axios({
                method,
                url,
                headers,
                data,
                maxRedirects: 0,
                validateStatus: status => (status >= 200 && status < 300) || status === 302 || 307
            });
    
            // 리다이렉트 처리
            if ([302, 307].includes(response.status) && response.headers.location) {
                url = response.headers.location;
                redirectCount++;
            }

        } while ([302, 307].includes(response.status) && redirectCount < 5);
    }catch(e){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log("Error Message:", util.inspect(e, { showHidden: false, depth: null, colors: true }));
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        return false;
    }

    
    console.log("\n\n================================================================================================================================================================================================");
    console.log("Response Status:", util.inspect(response.status, { showHidden: false, depth: null, colors: true }));
    console.log("Response Url:", util.inspect(url, { showHidden: false, depth: null, colors: true }));
    console.log("Request Headers:", util.inspect(headers, { showHidden: false, depth: null, colors: true }));
    console.log("Request Body:", util.inspect(data, { showHidden: false, depth: null, colors: true }));
    console.log("Response Headers:", util.inspect(response.headers, { showHidden: false, depth: null, colors: true }));
    console.log("Response Data:", util.inspect(response.data, { showHidden: false, depth: null, colors: true }));
    console.log("================================================================================================================================================================================================\n\n");

    // 응답 데이터 포맷팅 및 반환
    return {
        success: true,
        data: response.data,
    };
}
