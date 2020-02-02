import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './components/map/map.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    @ViewChild('csvReader') csvReader: any;
    @ViewChild('map') map: MapComponent;

    public showUploadInput: boolean = false;
    public showAddForm: boolean = false;
    public locationList: Array<LocationItem> = [];
    public imageViewerSrc: string = null;

    constructor() {
    }

    public fileUploadListener($event) {
        let files = $event.srcElement.files;

        if (this.isValidCSVFile(files[0])) {
            this.showUploadInput = false;
            let input = $event.target;
            let reader = new FileReader();
            reader.readAsText(input.files[0]);

            reader.onload = () => {
                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r\n|\n/);
                this.addLocationsToList(csvRecordsArray);
            };

            reader.onerror = function () {
                console.log('error is occured while reading file!');
            };

        } else {
            alert('Please import valid .csv file.');
        }
    }

    private addLocationsToList(csvRecordsArray: Array<string>) {
        // remove header array
        let keysLength = csvRecordsArray[0].split(',').length;
        csvRecordsArray.splice(0, 1);
        csvRecordsArray.forEach(csvRecord => {
            if (csvRecord.split(',').length === keysLength) {
                this.locationList.push(new LocationItem(csvRecord.split(',')));
            }
        });
        this.map.reloadMarkers(this.locationList);
        console.log(this.locationList);
    }

    private isValidCSVFile(file: any) {
        return file.name.endsWith('.csv');
    }

    public toggleMarkerVisibility(location: LocationItem) {
        location.visible = !location.visible;
        this.map.showHideMarker(location.id, location.visible);
    }

    public centerMapToLocation(location: LocationItem) {
        this.map.centerMap(parseFloat(location.latitude), parseFloat(location.longitude));
    }
}

export class LocationItem {
    public id: any;
    public companyName: any;
    public founder: any;
    public city: any;
    public country: any;
    public postalCode: any;
    public street: any;
    public photoUrl: any;
    public websiteUrl: any;
    public latitude: any;
    public longitude: any;
    public visible: boolean = true;

    constructor(csvRecord: Array<string>) {
        this.id = csvRecord[0].trim();
        this.companyName = csvRecord[1].trim();
        this.founder = csvRecord[2].trim();
        this.city = csvRecord[3].trim();
        this.country = csvRecord[4].trim();
        this.postalCode = csvRecord[5].trim();
        this.street = csvRecord[6].trim();
        this.photoUrl = csvRecord[7].trim();
        this.websiteUrl = csvRecord[8].trim();
        this.latitude = csvRecord[9].trim();
        this.longitude = csvRecord[10].trim();
    }
}
