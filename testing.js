import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import template from './navigation.html';
import './navigation.css'
import {
  Session
}
from 'meteor/session'

import {
  Notifications

}
from '../../api/notification.js';

import {
  Person
}
from '../../../imports/api/person.js'

class Navigation {
  constructor($scope, $reactive, $state, $rootScope, CurrentPage, isImageValid, menuHeaderService) {
    'ngInject';
    this.$state = $state
    this.self = this
    this.issearch = false;
    $reactive(this).attach($scope);
    let self = this
    this.CurrentPage = CurrentPage
    $scope.noNotifications = false
    $scope.backBtnStatus = true
    this.subscribe("userList")
      //this.subscribe("notifications")

    this.currentImagePath = "header/teacher_profile1.png"
    this.error = '';
    if ($state.current.name === "" || $state.current.name == "dashboard") {
      $scope.backBtnStatus = false
    }

    this.currentImage = Meteor.users.findOne()

    this.autorun(() => {
      this.isLoggedIn = !!Meteor.userId()
      this.currentUser = Meteor.users.findOne()
      let person = Person.findOne({
        user_id: Meteor.userId()
      });
      if (person) {
        Session.set('school_id', person.school_id)
      }

      this.weakSignalStrength = true
        //this.noNotifications = false
        /*this.notifications = Notifications.find({}, {
            sort: {
                "gen-date": -1
            }
        }).fetch()


        self.notificationCounts = _.filter(self.notifications, function(note) {
            return note.status == "active"
        }).length*/


      // if (this.notifications.length >= 1) {
      //     _.each(this.notifications, function(eachNotify) {
      //         eachNotify.noti_icon = (eachNotify.icon_type === 1) ? 'notifications/notify_04.png' : (eachNotify.icon_type === 2) ? 'notifications/notify_06.png' : (eachNotify.icon_type === 3) ? 'notifications/notify_08.png' : (eachNotify.icon_type === 4) ? 'notifications/notify_10.png' : (eachNotify.icon_type === 5) ? 'notifications/notify_12.png' : (eachNotify.icon_type === 6) ? 'notifications/notify_rejected.png' : 'NA';
      //     })
      // } else {
      //     this.noNotifications = true
      // }

      /* if (this.notifications.length >= 1) {
           _.each(this.notifications, function(eachNotify) {
               if (eachNotify.icon_type === 1) {
                   eachNotify.noti_icon = 'notifications/notify_04.png';
               }
               if (eachNotify.icon_type === 2) {
                   eachNotify.noti_icon = 'notifications/notify_06.png';
               }
               if (eachNotify.icon_type === 3) {
                   eachNotify.noti_icon = 'notifications/notify_08.png';
               }
               if (eachNotify.icon_type === 4) {
                   eachNotify.noti_icon = 'notifications/notify_10.png';
               }
               if (eachNotify.icon_type === 5) {
                   eachNotify.noti_icon = 'notifications/notify_12.png';
               }
               if (eachNotify.icon_type === 6) {
                   eachNotify.noti_icon = 'notifications/notify_rejected.png';
               }
           })
       } else {
           this.noNotifications = true
       }*/

    })


    $scope.subscribe("notifications", () => [$scope.getReactively("notificationTracker", true)], {
      onReady: function() {
        //getting customer details from minimongo
        if (Notifications.find({}).count() === 0) {
          $scope.noNotifications = true
        } else {
          $scope.noNotifications = false
          $scope.getNotifyData();
          $scope.noNotifications = Notifications.find({}).count() === 0 ? true : false
        }


      },
      onStop: function(error) {
        if (error) {
          console.log('An error happened - ', error);
        } else {
          //console.log('The Notification subscription stopped');
        }
      }
    });
    this.autorun = () => {
      $scope.getNotifyData();
    }
    $scope.getNotifyData = () => {
      $scope.notifications = Notifications.find({

      }, {
        sort: {
          "gen-date": -1
        }
      }).fetch()
      //Added for read and unread statements 
      //Developer : Shereen.
    _.each( $scope.notifications, function(data) {
        if (data.notification_status != undefined) {
          _.each(data.notification_status, function(user_details) {
            if (user_details.user_id === Meteor.userId()) {
              data.notificationClicked = true

            };
          })

        };
      })

      // $scope.notificationsCount = $scope.notifications.length
      $scope.notificationsCount = _.filter($scope.notifications, function(note) {
        return note.status == "active"
      }).length

      let notificationTrackingTime = Meteor.users.findOne({
        _id: Meteor.userId()
      })
      let notiTrackingTime = notificationTrackingTime ? notificationTrackingTime.notification_tracking : null;
      if (notiTrackingTime) {
        $scope.notificationCounts = Notifications.find({
          $and: [{
            "recipient._id": {
              $in: [Meteor.userId()]
            }
          }, {
            "gen-date": {
              $gte: notiTrackingTime
            }
          }]
        }).count()
      } else {
        /* $scope.notificationCounts = Counts.get("notificationCount")*/
      }
      //$scope.notificationCounts = Counts.get("notificationCount")
      if ($scope.notifications.length >= 1) {
        _.each($scope.notifications, function(eachNotify) {
          //console.log(eachNotify)

          //user Oriented
          if (eachNotify.icon_type === 1) {
            eachNotify.noti_icon = 'notifications/notify_04.png';
          }
          //Success Message
          if (eachNotify.icon_type === 2) {
            eachNotify.noti_icon = 'notifications/notify_06.png';
          }
          //Approved
          if (eachNotify.icon_type === 3) {
            eachNotify.noti_icon = 'notifications/notify_08.png';
          }
          //Request
          if (eachNotify.icon_type === 4) {
            eachNotify.noti_icon = 'notifications/notify_10.png';
          }
          //Info
          if (eachNotify.icon_type === 5) {
            eachNotify.noti_icon = 'notifications/notify_12.png';
          }
          //Rejected
          if (eachNotify.icon_type === 6) {
            eachNotify.noti_icon = 'notifications/notify_rejected.png';
          }
        })
      } else {
        $scope.noNotifications = Notifications.find({}).count() === 0 ? true : false
      }
    }




    // if (!this.currentImage || this.currentImage.image !== undefined) {
    //   if (this.currentImage.image.original) {
    //     isImageValid.isValid(FILE_UPLOAD_URL + this.currentImage.image.original, function(res){
    //       if (res === true) {
    //         this.currentImage.image.original = FILE_UPLOAD_URL + this.currentImage.image.original
    //         $scope.$apply()
    //       } else{
    //         this.currentImage = {}
    //         this.currentImage.image = {}
    //         this.currentImage.image.original = "header/teacher_profile1.png"
    //       }
    //     })
    //   } 
    // }
    //Developer : Babin
    //Date : 21-08-2017
    //comment check the from state to state for back button starts
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      if (toState.name === "dashboard") {
        $scope.backBtnStatus = false
      } else {
        $scope.backBtnStatus = true
      }
    })

    $scope.routeToPage = function(notification) {

      Meteor.call("updateNotificationStatus", notification._id,Meteor.userId(), function(error, result) {
        
      });
      /*100 - Dictation
      101 - Assignment
      102 - Assessment
      103 - Drawing
      104 - Set availability
      105 - Quiz
      106-SEND
      109-EYFS
      200-FPI - FPI Scheduler
      201-FPI - HOS Activity
      500-Profile achievements/contributions etc
      700-Club
      777-ASL
      1100-Set Target
      3100-Announcement
      1500-cpd

      2001-Teaching Plan for HOD
      6001-Report create
      7001-survey

      3002- Teaching plan for teacher
      */

      self.notificationCounts = 0;
      /*Notification ICONS*/
      $rootScope.notif_id = null;
      switch (parseInt(notification.type)) {

        case 600:
          if (notification.references != undefined && notification.references.parent_state != undefined) {
            Session.set("authoringData", notification.references.authoringData)
            $state.go(notification.references.parent_state, {
              user_id: Meteor.userId(),
              schedule_id: notification.references.schedule_id,
              is_fpi_survey: notification.references.is_fpi_survey
            })
          }
          break;
        case 601:
          if (notification.references != undefined) {
            $state.go('listSurveyAnswer', {
              surveyId: notification.references.survey_id,
              parent_state: notification.references.parent_state,
              user_id: Meteor.userId(),
              schedule_id: notification.references.schedule_id,
              is_fpi_survey: notification.references.is_fpi_survey
            })
          }
          break;
        case 100:
          $rootScope.notif_id = notification._id;
          $state.go('viewDictation');
          // if (Session.get('role') === "teacher") {
          //   $state.go('teacherDictation');
          // } else if (Session.get('role') === "student") {
          //   $state.go('viewDictation');
          // }
          break;
        case 101:
          if (userData.role_ids.indexOf('student') !== -1) {
            $state.go('studentNewAssignmentView', {
              "getAssginmentQuestion": notification.title,
              "assignment_id": notification.references,
              "question_id": notification.references
            });
          } else {
            $state.go('assignment');
          }
          break;
        case 102:

          if (self.getNotification && Notifications.find({}).fetch().length > 0) {
            for (var i = 0; i < self.getNotification.data.length; i++) {
              // console.log(self.getNotification.data[i].student_id + "===" + Meteor.userId())
              //Check nofication data have the the current user 
              //---START---
              if (self.getNotification.data[i].student_id === Meteor.userId()) {

                //Check onexam is true for current user
                //if condition start
                if (!self.getNotification.data[i].onExam) {
                  //console.log(self.getNotification.data[i].onExam)
                  if (userData.role_ids.indexOf('student') !== -1) {

                    let quizObj = {
                        "teacher_id": notification.sender_id,
                        "quiz_id": notification.references,
                        'type': "assessment"
                      }
                      //                                            ToastService.getToastbox($mdToast, "You Cannot Restart Activity", 'error-toast');
                    if (notification.references.subject_id != undefined) {
                      Session.setAuth("subjectId", notification.references.subject_id)
                      Session.setAuth("classId", notification.references.class_id)
                      Session.setAuth("batchId", notification.references.batch_id)
                      Session.setAuth("sessionId", notification.references.session_id)
                      Session.setAuth("curriculumId", notification.references.curriculum_id)
                    }
                    $state.go('assessmentList');

                  } else {
                    $state.go('teacherAssessmentList');
                    if (notification.references.subject_id != undefined) {
                      Session.setAuth("subjectId", notification.references.subject_id)
                      Session.setAuth("classId", notification.references.class_id)
                      Session.setAuth("batchId", notification.references.batch_id)
                      Session.setAuth("sessionId", notification.references.session_id)
                      Session.setAuth("curriculumId", notification.references.curriculum_id)
                    }
                  }

                }
              }

            }
          }
          break;
        case 103:
          if (userData.role_ids.indexOf('student') !== -1) {
            $state.go('studentDrawingView', {
              "getAssginmentQuestion": notification.references,
              "assignment_id": notification.references,
              "question_id": notification.references
            });
          } else {
            $state.go('drawingAssignmentList');
          }
          break;
        case 104:
          $state.go('avalibility');
          break;
        case 105:
          if (self.getNotification && Notifications.find({}).fetch().length > 0) {
            for (var i = 0; i < self.getNotification.data.length; i++) {
              // console.log(self.getNotification.data[i].student_id + "===" + Meteor.userId())
              //Check nofication data have the the current user 
              //---START---
              if (self.getNotification.data[i].student_id === Meteor.userId()) {

                //Check onexam is true for current user
                //if condition start
                if (!self.getNotification.data[i].onExam) {
                  //console.log(self.getNotification.data[i].onExam)
                  if (userData.role_ids.indexOf('student') !== -1) {
                    let quizObj = {
                        "teacher_id": notification.sender_id,
                        "quiz_id": notification.references,
                        'type': "quiz"
                      }
                      //                                            ToastService.getToastbox($mdToast, "You Cannot Restart Activity", 'error-toast');

                    if (notification.references.subject_id != undefined) {
                      Session.setAuth("subjectId", notification.references.subject_id)
                      Session.setAuth("classId", notification.references.class_id)
                      Session.setAuth("batchId", notification.references.batch_id)
                      Session.setAuth("sessionId", notification.references.session_id)
                      Session.setAuth("curriculumId", notification.references.curriculum_id)
                    }
                    $state.go('quizList');

                  } else {
                    $state.go('questionList');
                  }
                }
              }
            }
          }
          break;
          // case 106:
          //   if (Session.get('role') === "teacher") {
          //     $state.go('sendMainPage');
          //   } else if (Session.get('role') === "sen_coordinator") {
          //     $state.go('senCoMainPage');
          //   } else if (Session.get('role') === "sen_educator") {
          //     $state.go('senCoMainPage');
          //   } else {
          //     $state.go('parentSenHome');
          //   }
          //   break;
        case 107:
          $state.go('facultySearchFilter');
          /*if (Session.get('role') === "pricipal") {
              $state.go('fpiApproval');
          } else if (Session.get('role') === "hod") {
              $state.go('fpiPointsTeache'); //id of teacher 
          } else if (Session.get('role') === "hos") {
              $state.go('fpiPointsTeache'); //id of teacher 
          } else {
              $state.go("myOwnReports")
          }*/
          break;
        case 109:
          QuestionsFactory.addEyfsId(notification.references._id)
          $state.go('studentReportView', {
            "getTeachingPlan": notification.references
          });
          break;
        case 200:
          $state.go('facultyEvaluationFilter');
          break;
        case 201:
          $state.go('hosOwnDashboard');
          break;
        case 202:
          //FPI points noti for teacher
          $state.go('myDashboard');
          break;
        case 203:
          //FPI points dispute request from teacher to Princi
          $state.go('pointsObservation');
          break;
        case 204:
          //FPI points dispute approve/reject to teacher from Princi
          $state.go('myDashboard');
          break;
        case 205:
          //FPI report submission to Principal
          $state.go('criteriaApproval');
          /*$state.go("fpiCriteriaApprovals", {
            "f_id": notification.references.faculty_id
          })*/
          break;
        case 206:
          //FPI published report to Teacher
          $state.go('fpiEvaluationReport', {
            "faculty_id": notification.references.faculty_id,
            "schedule_id": notification.references.schedule_id,
            "faculty_role_id": notification.references.faculty_role_id
          });
          break;
        case 211:
          //FPI Rejected Self Evaluation
          $state.go('myDashboard');
          break;
        case 208:
          //FPI Rejected Criteria Reports
          $state.go('facultyDashboard', {
            "faculty_id": notification.references.faculty_id,
            "faculty_role_id": notification.references.faculty_role_id
          });
          break;
        case 207:
          //HOS Uploaded Document to Principal
          $state.go("hosDashboard", {
            "faculty_id": notification.references.user_id,
            "faculty_role_id": notification.references.role_id
          })
          break;
        case 209:
          //Teacher' dashboard at Principal/HOD/HOS
          $state.go("fpiPointsTeacher", {
            "f_id": notification.references.faculty_id
          })
          break;
        case 210:
          //For HOS criteria
          $state.go("hosOwnDashboard");
          break;
        case 300:
          //Mark entry approval request to class teacher
          $state.go('endrosementList');
          break;
        case 301:
          //Mark entry approve/reject to subject teacher
          if (notification.references.subject_id != undefined) {
            Session.setAuth("subjectId", notification.references.subject_id)
            Session.setAuth("classId", notification.references.class_id)
            Session.setAuth("batchId", notification.references.batch_id)
            Session.setAuth("sessionId", notification.references.session_id)
            Session.setAuth("curriculumId", notification.references.curriculum_id)
          }
          $state.go('examEntryList');
          break;
        case 500:
          //Mark entry approve/reject to subject teacher
          $state.go('peopleLookUp', {
            "user_id": notification.references.user_id
          });
          break;
        case 400:
          // SEND Teacher notification
          //$state.go('sendMainPage');
          $state.go('senWaveProcess', {
            studentDetails: notification.references
          });
          break;
        case 401:
          // SEND CO Ordinator notification redirect page
          $rootScope.notif_id = notification._id;
          //$state.go('senCoMainPage');
          //$window.localStorage.setItem("studentDetails", angular.toJson(notification.references));
          $state.go('studentProfileView', {
            studentDetails: notification.references
          });
          break;
        case 402:
          // SEND Counselor & SEND Educator notification
          $state.go('studentProfileView', {
            studentDetails: notification.references
          });
          break;
        case 403:
          // SEND Parent notification
          $rootScope.notif_id = notification._id;
          // $state.go('parentSenHome');
          $state.go('parentChildSenPage', {
            studentDetails: notification.references
          });
          break;
        case 404:
          // SEND Counselor notification
          $state.go('studentProfileView', {
            studentDetails: notification.references
          });
          break;
        case 800:
          // Availability notification for parent
          $state.go('getAvailability');
          break;
          /*medical start*/
        case 1000:
          $state.go('doctorUserProgramList');
          break;
        case 1001:
          $state.go('medicalProfile', {
            f_id: notification.references.patient_id
          });
          break;
        case 1002:
          $state.go('medicalProfile', {
            f_id: notification.references._id
          });
          break;
        case 1003:
          $state.go('doctorParentChildProfile', { //immunization notification to parent
            studentDetails: notification.references.studentId
          });
          break;
        case 1004:
          $state.go('patientDashboard');
          break;
        case 1005:
          $state.go('patientDashboard');
          break;
        case 1006:
          $state.go('patientDashboard');
          break;
        case 1007:
          $state.go('patientDashboard');
          break;
        case 1008:
          $state.go('patientDashboard');
          break;
        case 1009:
          $state.go('patientDashboard');
          break;
        case 1010:
          $state.go('patientDashboard');
          break;
        case 1011:
          $state.go('doctorUserProgramList');
          break;
        case 1012:
          $state.go('doctorParentChildProfile', { //first aid create std to parent
            studentDetails: notification.references._id
          });
          break;
        case 1013:
          $state.go('doctorParentChildProfile', { //referal create std to parent
            studentDetails: notification.references._id
          });
          break;

        case 1014:
          $state.go('doctorParentChildProfile', { //vaccine create std to parent
            studentDetails: notification.references._id
          });
          break;
        case 1015:
          $state.go('doctorParentChildProfile', { //fa edit std to parent
            studentDetails: notification.references._id
          });
          break;
        case 1016:
          $state.go('doctorParentChildProfile', { //vaccine edit std to parent
            studentDetails: notification.references._id
          });
          break;
        case 1017:
          $state.go('doctorParentChildProfile', { //emegency edit std to parent
            studentDetails: notification.references._id
          });
          break;
          /*medical ends*/
        case 700:
          //Club Activities -Developed by: Shereen
          Session.set("isClubOwnerID", notification.references.owner_id)
          Session.set("selectedClubId", notification.references.club_id)
          $state.go('clubPost', {
            "clubId": notification.references.club_id,
            "ownerId": notification.references.owner_id
          });
          break;
        case 777:
          //for ASL activity
          ASLFactory.addCategory(notification.references)
          $state.go('aslList');
          break;
        case 3100:

          $state.go('announcements');
          break;
        case 1500:
          $state.go('cpdTraining');
          break;
        case 2001:
          $state.go('approverTeachingPlanView', {
            "getTeachingPlan": notification.references._id
          });
          break;
        case 2002:
          $state.go("calendar")
          break;
        case 900:
          // $state.go('studentAssignmentList')
          break;
        case 901:
          //$state.go('assessmentList')
          break;
        case 4001:
          //formative assessment
          $state.go('formativeAssessmentList');
          break;
        case 6001:
          //Report card creation
          $state.go('showReportCards');
          break;
          // case 222:
          //     $state.go('chatComponent', {}, {
          //         reload: true
          //     });
          //     , {
          //         "subjectId": notification.references.subject_id,
          //         "classId": notification.references.class_id,
          //         "batchId": notification.references.batch_id,
          //         "sessionId": notification.references.session_id,
          //         "curriculumId": notification.references.curriculum_id
          //     }
          //     Session.setAuth("chat_subjectId", notification.references.subject_id)
          //     Session.setAuth("chat_classId", notification.references.class_id)
          //     Session.setAuth("chat_batchId", notification.references.batch_id)
          //     Session.setAuth("chat_sessionId", notification.references.session_id)
          //     Session.setAuth("chat_curriculumId", notification.references.curriculum_id)
          //     break;
        case 110:
          Session.set("chat_subjectId", notification.references.subject_id)
          Session.set("chat_classId", notification.references.class_id)
          Session.set("chat_batchId", notification.references.batch_id)
          Session.set("chat_sessionId", notification.references.session_id)
          Session.set("chat_curriculumId", notification.references.curriculum_id)
          $state.go('chat');
          break;
        case 111:
          Session.set("authoringData", notification.references)
          $state.go('forum');
          break;
        case 112:
          Session.set("authoringData", notification.references)
          $state.go('faq');
          break;
          /*     case 3002:
                 if (Session.get('role') === "teacher") {
                   let subObj = {
                     "curriculum": notification.references.curriculum_id,
                     "session": notification.references.session_id,
                     "class": notification.references.class_id,
                     "batch": notification.references.batch_id,
                     "subject": notification.references.subject_id,
                     "id": notification.references._id,
                     "theme_id": notification.references.theme_id,
                     "status": notification.references.status,
                     "qTitle": notification.references.qTitle,
                     "topic": notification.references.topic,
                     "objective": notification.references.objective,
                     "teaching_plan": notification.references.teaching_plan,
                     "resources": notification.references.resources,
                     "report_authority": notification.references.report_authority
                   }
                   getStudents.addSubjectDetails(subObj)
                   if (notification.references.status == 'Rejected') {
                     $state.go('createTeachingPlan');
                   } else {
                     $state.go('teacherPlanView', {
                       "getTeachingPlan": notification.references._id
                     });
                   }
                 }
                 break;*/
        case 7001:
          //Survey -authoring tool - Developed by : Shereen
          $state.go("attemptSurvey", {
            "surveyId": notification.references
          })
          break;
        case 7005:
          $state.go("viewCreatedReportData", {
            "dataId": notification.references
          })
          break;
        case 7007:
          $state.go("reportconsole", {
            "cardId": notification.references
          })
          break;
        case 7006:
          $state.go("viewCreatedReportData", {
            "dataId": notification.references
          })
          break;
        case 113:
          Session.set("authoringData", notification.references.academic_details)
          menuHeaderService.setAuthMenu()
          $state.go('viewTeachingPlan', {
            "planId": notification.references.plan_id
          });
          break;

        case 3001:
          Session.set("notifyData", notification.references)
          $state.go('send');
          break;
        case 3003:
          Session.set("notifyData", notification.references)
          $state.go('giftedTalented');
          break;
        case 114:
          Session.set("authoringData", notification.references.academic_details)
          Session.set("resources", notification.references.resources)
          $state.go('wizard.activityFormPreview', {
            "planId": notification.references.plan_id,
            "resource": notification.references.res_id
          });
          break;
        case 1100:
          //Set Target- Developed by: Shereen
          Session.set("authoringData", notification.references.academic_details)
          $state.go('setTarget', {});
          break;
        default:
          /*console.log("default")*/
          return false
          break;
      }
    }

  }

  goBack() {
    window.history.back();
  }

  openMenuAll($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  }

  openNotificationMenu($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  }

  // setOfflineValues(detailObj, userId) {
  //   if (detailObj) {
  //     Meteor.call('setOffline', detailObj, userId, (error, result) => {
  //       if (error) {
  //         console.log("Error:" + error);
  //       } else {
  //         //
  //       }
  //     })
  //   }
  //   //Session.clearAuth()
  //   Session.clear()
  // }

  checkSignalStrength() {
    //Added to check internet signal strength
    setInterval(function() {
      $.ajax({
        url: SITE_URL,
        timeout: 3000, //timeout to 3s
        type: "GET",
        cache: false,
        success: function(data) {
          this.self.weakSignalStrength = false
        },
        error: function(x, y, z) {
          if (x.status == 0) {
            this.self.weakSignalStrength = true
          } else {
            this.self.weakSignalStrength = true
          }
        }
      });
    }, 5000);
  }

  logoutSession() {
    let detailObj = {
      "session_id": Session.get('sessionId'),
      "curriculum_id": Session.get('curriculumId'),
      "class_id": Session.get('classId'),
      "batch_id": Session.get('batchId'),
      "subjects": Session.get('subjectId')
    }
    let userId = Meteor.userId()
    self.state = this.$state
    Meteor.call("changePwdForMasterAdminOnly", userId, function(error, result) {
      if (result) {
        Accounts.logout((error) => {
          if (error) {
            toastr.error(error);
          } else {
            Session.clear();
            Session.clearAuth()
            self.state.go('login')
          }
        })
      }
    })

  }



}

const name = 'navigation';
// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
  ])
  .component(name, {
    templateUrl: template,
    controllerAs: name,
    controller: Navigation
  })
