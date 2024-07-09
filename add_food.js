document.addEventListener('DOMContentLoaded', function() {
    const foodForm = document.getElementById('foodForm');
    const foodNameInput = document.getElementById('foodName');
    const expiryDateInput = document.getElementById('expiryDate');
    const startScanButton = document.getElementById('startScanButton');
    const barcodeScanner = document.getElementById('barcodeScanner');
    const captureButton = document.getElementById('captureButton');
    const messageBox = document.getElementById('messageBox');
    const closeButton = document.getElementById('closeButton');

    foodForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const foodName = foodNameInput.value;
        const expiryDate = expiryDateInput.value;

        fetch('http://127.0.0.1:5000/api/add_food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ foodName: foodName, expiryDate: expiryDate })
        })
        .then(response => response.json())
        .then(data => {
            // メッセージボックスを表示する
            messageBox.style.display = 'block';
        })
        .catch(error => {
            console.error('Error occurred while adding food:', error);
            alert('エラーが発生しました。もう一度試してください。');
        });
    });

    closeButton.addEventListener('click', () => {
        // メッセージボックスを閉じる
        messageBox.style.display = 'none';
    });

    startScanButton.addEventListener('click', () => {
        // カメラ映像を表示する
        barcodeScanner.style.display = 'block';
        captureButton.style.display = 'block';
        startScanButton.style.display = 'none';

        // QuaggaJSを使ってバーコードをスキャンする
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: barcodeScanner
            },
            decoder: {
                readers: ['ean_reader']
            }
        }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected((data) => {
            const code = data.codeResult.code;
            console.log(`バーコード: ${code}`);

            // ここでバーコードから食品名を取得する処理を追加する
            // 仮の処理：バーコードを食品名として入力する
            foodNameInput.value = `食品名(${code})`;
        });
    });

    captureButton.addEventListener('click', () => {
        Quagga.stop();
        barcodeScanner.style.display = 'none';
        captureButton.style.display = 'none';
        startScanButton.style.display = 'block';
    });
});
;






