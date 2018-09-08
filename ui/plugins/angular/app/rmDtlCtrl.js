app.controller('rmDtlCtrl', function($rootScope,$http,$scope,$route,$filter) {
    var params = $route.current.params;
    $scope.persons = [];
    $scope.origin_address = null;
    // $scope.districts= json_districts;
    $scope.is_header_family = false;


    $http.get($rootScope.apiUrl+"/home/roomDetail?room_id="+params.id)
    .then(function(response) {
        $scope.roomDetail = response.data.data;
        if($scope.roomDetail.find){
            var family = $scope.roomDetail.family;
            $scope.family_id = family.FAMILY_ID
            $scope.family_name = family.FAMILY_NAME;
            $scope.members = family.MEMBERS;
            $scope.headFam = family.PERSON;
            $scope.headFamCur = family.PERSON.CURRENT;
            $scope.fullname = $scope.headFamCur.FIRST_NAME;
            $scope.idCard = $scope.headFamCur.PERS_N_ID;
            $scope.national = $scope.headFamCur.NATIONALITY;
            $scope.edu = $scope.headFamCur.EDUCATION;
            $scope.career = $scope.headFamCur.CAREER;
            $scope.academy = $scope.headFamCur.ACADEMY;
            $scope.mobile = $scope.headFamCur.MOBILE_NBR_1;
            $scope.phone = $scope.headFamCur.PHONE_NBR;
            $scope.origin_address_descr = $scope.headFamCur.ADDRESS_1_TYPE0;
            $scope.origin_address = $scope.headFamCur.DISTRICT_ID_TYPE0;
            $scope.car = $scope.headFamCur.CAR_NUMBER;
            $scope.biker = $scope.headFamCur.BIKER_NUMBER;
            $scope.reference = $scope.headFamCur.REFERENCE;
            $scope.gender = $scope.headFamCur.GENDER ;
            $scope.birth_date = $scope.headFam.BIRTHDAY;
            $scope.start_date = family.start_date.split(" ")[0];
            $scope.owner_group_id = $scope.headFam.OWNER_GROUP_ID;
            $scope.nickname = $scope.headFamCur.PERS_NICKNAME;
            // $scope.relation = $rootScope.HEAD_FAMILY_TEXT;
            $('#datepicker').datepicker("setDate",new Date($scope.headFam.BIRTHDAY));
            $('#datepicker2').datepicker("setDate",new Date(family.start_date));
        }else{
            $scope.room_detail = $scope.roomDetail.room;
            $scope.family_id = null;
            $scope.is_header_family = false;            
        }
    });
    $scope.setTable=(id)=>{
        $("#"+id).DataTable(); 
    }
    $scope.setDateTime = function(id,date){
        $('#datepicker_'+id).datepicker({
          dateFormat: 'dd-mm-yy',
          autoclose: true
        });
        $('#datepicker_'+id).datepicker("setDate",new Date(date));
    }
    $scope.setDateTime2 = function(id,date){
        $('#datepicker2_'+id).datepicker({
          dateFormat: 'dd-mm-yy',
          autoclose: true
        });
        $('#datepicker2_'+id).datepicker("setDate",new Date(date));
    }
    console.log(params);
    $("[data-mask]").inputmask();
    $('#datepicker').datepicker({
      dateFormat: 'dd-mm-yy',
      autoclose: true
    });
    $('#datepicker2').datepicker({
      dateFormat: 'dd-mm-yy',
      autoclose: true
    });
    $('.select2').select2({
      placeholder: "Select a state"
    });
    $('.select2').on('change', function() {
      var data = $(".select2 option:selected").val();
      $scope.origin_address =data;
    });
    $('.select2').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);    
    });
    $scope.getIdCard =()=>{
        return $("#idCard").val();
    }
    $scope.getMobile =()=>{
        return  $("#mobile").val();
    }
    $scope.getBirthDate =()=>{
        var a = new Date($( "#datepicker" ).datepicker( "getDate" ));
        console.log(a);
        console.log(a.getTime());
        // console.log($( "#datepicker" ).datepicker( "getDate" ));
    }
    $scope.clickImage=()=>{
        $("#exampleInputFile").click();
    }
    $scope.fileNameChanged = function (ele) {
      var files = ele.files;
      var l = files.length;
      console.log(files);
        var reader = new FileReader();
       reader.readAsDataURL(files[0]);
       reader.onload = function () {
         $scope.picture = reader.result;
         var img = $("#pictureView");
        img.attr("src",$scope.picture);
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }

    $scope.addBtn=()=>{
        if($scope.roomDetail.find){
            $scope.is_header_family = false;  
        }else{
            $scope.family_id = null;
            $scope.is_header_family = true;
            $scope.relation = $rootScope.HEAD_FAMILY_TEXT;
        }
    }

    $scope.save=()=>{
        $scope.getBirthDate();
        var data ={
            name : $scope.fullname,
            gender : $scope.gender,
            idCard : $("#idCard").val(),
            birth_date : $( "#datepicker").datepicker( "getDate" ),
            national:$scope.national,
            edu:$scope.edu,
            career:$scope.career,
            academy:$scope.academy,
            origin_address_descr:$scope.origin_address_descr,
            // origin_address:$scope.origin_address,
            mobile : $("#mobile").val(),
            phone : $("#phone").val(),
            car:$scope.car,
            biker:$scope.biker,
            reference : $scope.reference !=null ? $scope.reference : 'ไม่ระบุ',
            picture : $scope.picture,
            start_date:$( "#datepicker2" ).datepicker( "getDate" ),
            is_header_family : $scope.is_header_family,
            member_status : $scope.relation !=null ? $scope.relation:'ไม่ระบุ',
            roomId:params.id,
            person_type:3,
            family_id:$scope.family_id,
            owner_group_id:$scope.owner_group_id != null ? $scope.owner_group_id : 0,
            nickname:$scope.nickname,
            pv:$scope.pv == null ? "0":$scope.pv,
            ap:$scope.ap == null ? "0":$scope.ap,
            dt:$scope.dt == null ? "0":$scope.dt

        }
        console.log(data);
        $rootScope.api({
            method:"POST",
            url: "/person/add",
            data:{personRqType:data},
            success:function(res){
                console.log(res);
                $route.reload();
            },
            fail:function(){

            }

        });
    }
    $scope.changeRoomStatus = (status)=>{
        $rootScope.api({
            method:"GET",
            url: "/home/room/changeStatus/"+$scope.room_detail.ROOM_ID+"/"+status,
            data:{},
            success:function(res){
                console.log(res);
                $route.reload();
            },
            fail:function(){

            }

        });   
    }
       
    
});

app.controller('mbDtlCtrl', function($rootScope,$http,$scope,$route,$filter) {
    var params = $route.current.params;
    $http.get($rootScope.apiUrl+"/person/memberDetail?id="+params.id+"&h="+params.h)
    .then(function(response) {
        // $scope.districts= json_districts;
        $scope.person = response.data.data;
        $scope.person.birth_date = $scope.person.birth_date.split(" ")[0]; 
        $scope.person.start_date = $scope.person.start_date.split(" ")[0]; 
        // $scope.person.origin_address = $filter('filter')($rootScope.districts , {'d_id':$scope.person.origin_address})[0];
        // $scope.person.pv = $scope.person.pv.id;
        // alert($scope.person.pv);
    });
});
app.controller('mbEdtCtrl', function($rootScope,$http,$scope,$route,$filter) {
    var params = $route.current.params;
    $http.get($rootScope.apiUrl+"/person/memberDetail?id="+params.id+"&h="+params.h)
    .then(function(response) {
        $scope.person = response.data.data;
        $('#datepicker').datepicker("setDate",new Date($scope.person.birth_date));
        $('#datepicker2').datepicker("setDate",new Date($scope.person.start_date));
        $scope.person.pv = $scope.person.pv.id;
        $rootScope.getAmphures($scope.person.pv);
        $scope.person.ap = $scope.person.ap.id;
        $rootScope.getDistricts($scope.person.ap);
        $scope.person.dt = $scope.person.dt.id;
    });
    $("[data-mask]").inputmask();
    $('#datepicker').datepicker({
      dateFormat: 'dd-mm-yy',
      autoclose: true
    });
    $('#datepicker2').datepicker({
      dateFormat: 'dd-mm-yy',
      autoclose: true
    });
    $('.select2').select2({
      placeholder: "Select a state"
    });
    $('.select2').on('change', function() {
      var data = $(".select2 option:selected").val();
      $scope.person.origin_address =data;
    });
    $scope.getIdCard =()=>{
        return $("#idCard").val();
    }
    $scope.getMobile =()=>{
        return  $("#mobile").val();
    }
    $scope.clickImage=()=>{
        $("#exampleInputFile").click();
    }
    $scope.fileNameChanged = function (ele) {
      var files = ele.files;
      var l = files.length;
      console.log(files);
        var reader = new FileReader();
       reader.readAsDataURL(files[0]);
       reader.onload = function () {
         $scope.picture = reader.result;
         var img = $("#pictureView");
        img.attr("src",$scope.picture);
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }
    $scope.picture = null;
    $scope.edit=()=>{
        // $scope.getBirthDate();
        var data ={
            pers_id:$scope.person.pers_id,
            name : $scope.person.fullname,
            gender : $scope.person.gender,
            idCard : $("#idCard").val(),
            birth_date : $( "#datepicker").datepicker( "getDate" ),
            national:$scope.person.national,
            edu:$scope.person.edu,
            career:$scope.person.career,
            academy:$scope.person.academy,
            origin_address_descr:$scope.person.origin_address_descr,
            // origin_address:$scope.person.origin_address,
            mobile : $("#mobile").val(),
            phone : $("#phone").val(),
            car:$scope.person.car,
            biker:$scope.person.biker,
            reference : $scope.person.reference,
            picture : $scope.picture,
            start_date:$( "#datepicker2" ).datepicker( "getDate" ),
            is_header_family : $scope.person.is_header,
            member_status : $scope.person.relation,
            // roomId:params.id,
            person_type:3,
            family_id:$scope.person.member_id,
            owner_group_id : $scope.person.owner_group_id,
            nickname : $scope.person.nickname,
            pv:$scope.person.pv == null ? "0":$scope.person.pv,
            ap:$scope.person.ap == null ? "0":$scope.person.ap,
            dt:$scope.person.dt == null ? "0":$scope.person.dt
        }
        console.log(data);
        $rootScope.api({
            method:"POST",
            url: "/person/edit",
            data:{personRqType:data},
            success:function(res){
                console.log(res);
                $route.reload();
            },
            fail:function(){

            }

        });
    }
});
app.controller('mbDltCtrl', function($rootScope,$http,$scope,$route,$filter) {
    $rootScope.page_name = "";
    var params = $route.current.params;
    $scope.roomId = params.roomId;
    // $scope.r = $route;
    $http.get($rootScope.apiUrl+"/person/memberDetail?id="+params.id+"&h="+params.h)
    .then(function(response) {
        $scope.person = response.data.data;
    });
    $scope.deleteMember = (id)=>{
        $http.get($rootScope.apiUrl+"/person/delete?id="+id)
        .then(function(response) {
            window.location.replace(appConfig.httphost+"/ui/#!/room_details?id="+$scope.roomId);
        });        
    }
    
});
app.controller('qrCtrl', function($rootScope,$http,$scope,$route,$filter) {
    var params = $route.current.params;
    $rootScope.page_name = "ห้อง" + $rootScope.getRoomStatus(params.status);
    var links = "";
    switch(params.p){
        case 'o': links = "?ownerId="+params.id+"&status="+params.status; break;
        case 'h': links = "?homeId="+params.id+"&status="+params.status; break;
        case 's': links = "?sectionId="+params.id+"&status="+params.status; break;
        default : links = "?ownerId="+params.id+"&status="+params.status;  break;
    }
    $http.get($rootScope.apiUrl+"/home/roomByStatus"+links)
    .then(function(response) {
        $scope.rooms = response.data.data;
        console.log($scope.rooms);       
    });

});