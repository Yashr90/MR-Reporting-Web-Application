import { Suspense, createElement, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// ─── Public Pages ────────────────────────────────────────────────────────────
const Home     = lazy(() => import("../pages/Home"));
const Login    = lazy(() => import("../pages/Login"));
const Services = lazy(() => import("../pages/Services"));
const About    = lazy(() => import("../pages/About"));
const Contact  = lazy(() => import("../pages/Contact"));

// ─── Admin Layout + Pages ────────────────────────────────────────────────────
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProfile   = lazy(() => import("../pages/admin/profile/AdminProfile"));

const DesignationCreation  = lazy(() => import("../pages/admin/masters/DesignationCreation"));
const UserDirectory        = lazy(() => import("../pages/admin/masters/UserDirectory"));
const UserCreation         = lazy(() => import("../pages/admin/masters/UserCreation"));
const AreaCreation         = lazy(() => import("../pages/admin/masters/AreaCreation"));
const DoctorChemistCreation = lazy(() => import("../pages/admin/masters/DoctorChemistCreation"));
const HeadquarterMapping   = lazy(() => import("../pages/admin/masters/HeadquarterMapping"));
const ChangeHeadquarter    = lazy(() => import("../pages/admin/masters/ChangeHeadquarter"));
const MasterDataTransfer   = lazy(() => import("../pages/admin/masters/MasterDataTransfer"));
const HierarchyManagement  = lazy(() => import("../pages/admin/masters/HierarchyManagement"));
const STPCreation          = lazy(() => import("../pages/admin/masters/STPCreation"));
const ProductCreation      = lazy(() => import("../pages/admin/masters/ProductCreation"));
const CRMDoctorMapping     = lazy(() => import("../pages/admin/masters/CRMDoctorMapping"));

const MasterData         = lazy(() => import("../pages/admin/approvals/MasterData"));
const ApproveTourProgram = lazy(() => import("../pages/admin/approvals/ApproveTourProgram"));
const STPApprove         = lazy(() => import("../pages/admin/approvals/STPApprove"));

const FareRateCard = lazy(() => import("../pages/admin/expenses/FareRateCard"));
const StateWiseDA  = lazy(() => import("../pages/admin/expenses/StateWiseDA"));

const SSSSubmitModify               = lazy(() => import("../pages/admin/stock-statement/SSSSubmitModify"));
const SSSView                      = lazy(() => import("../pages/admin/stock-statement/SSSView"));
const UserStockistMapping          = lazy(() => import("../pages/admin/stock-statement/UserStockistMapping"));
const StockistMappingDeletionReport = lazy(() => import("../pages/admin/stock-statement/StockistMappingDeletionReport"));

const TargetSubmission = lazy(() => import("../pages/admin/targets/TargetSubmission"));
const TargetModify     = lazy(() => import("../pages/admin/targets/TargetModify"));
const TargetView       = lazy(() => import("../pages/admin/targets/TargetView"));

const DCRConsolidate              = lazy(() => import("../pages/admin/reports/daily-call-reports/DCRConsolidate"));
const DumpDCRReport               = lazy(() => import("../pages/admin/reports/daily-call-reports/DumpDCRReport"));

const ViewProvider                = lazy(() => import("../pages/admin/reports/providers-reports/ViewProvider"));
const DoctorVisit                 = lazy(() => import("../pages/admin/reports/providers-reports/DoctorVisit"));
const ChemistStockistVisitReport  = lazy(() => import("../pages/admin/reports/providers-reports/ChemistStockistVisitReport"));
const MissedProvider              = lazy(() => import("../pages/admin/reports/providers-reports/MissedProvider"));
const ProviderVisitAnalysis       = lazy(() => import("../pages/admin/reports/providers-reports/ProviderVisitAnalysis"));
const POBReport                   = lazy(() => import("../pages/admin/reports/providers-reports/POBReport"));
const POBManagerWise = lazy(() => import("../pages/admin/reports/providers-reports/POBManagerWise"));
const POBEmployeeWise = lazy(() => import("../pages/admin/reports/providers-reports/POBEmployeeWise"));
const POBProductWise = lazy(() => import("../pages/admin/reports/providers-reports/POBProductWise"));
const UpdateProviderStatus = lazy(() => import("../pages/admin/reports/providers-reports/UpdateProviderStatus"));
const SpecialityDoctorReport = lazy(() => import("../pages/admin/reports/providers-reports/SpecialityDoctorReport"));
const SpecialityDoctorVisit = lazy(() => import("../pages/admin/reports/providers-reports/SpecialityDoctorVisit"));


// ─── Manager Layout + Pages (COMMENTED LINE BY LINE EXCEPT ACTIVE LOGINS) ────
const ManagerLayout = lazy(() => import("../layouts/ManagerLayout"));
const ManagerDashboard = lazy(() => import("../pages/manager/ManagerDashboard"));
// const ManagerProfile   = lazy(() => import("../pages/manager/profile/ManagerProfile"));

// Manager Reports - Daily Call Reports
// const ManagerDcrConsolidate = lazy(() => import("../pages/manager/reports/daily-call-reports/DcrConsolidate"));
// const ManagerTeamAttendance = lazy(() => import("../pages/manager/reports/daily-call-reports/TeamAttendance"));
// const ManagerFinancialYearlyJoint = lazy(() => import("../pages/manager/reports/daily-call-reports/FinancialYearlyJoint"));
// const ManagerDoctorActivityYearly = lazy(() => import("../pages/manager/reports/daily-call-reports/DoctorActivityYearly"));
// const ManagerMonthlySummary = lazy(() => import("../pages/manager/reports/daily-call-reports/MonthlySummary"));
// const ManagerCallAvgWorking = lazy(() => import("../pages/manager/reports/daily-call-reports/CallAvgWorking"));

// Manager Reports - Doctor/Chemist/Stockiest
// const ManagerViewDoctorChemist = lazy(() => import("../pages/manager/reports/providers/ViewDoctorChemist"));
// const ManagerDoctorVisit = lazy(() => import("../pages/manager/reports/providers/DoctorVisit"));
// const ManagerChemistStockiestVisit = lazy(() => import("../pages/manager/reports/providers/ChemistStockiestVisit"));
// const ManagerMissedDoctorChemist = lazy(() => import("../pages/manager/reports/providers/MissedDoctorChemist"));
// const ManagerStationDetails = lazy(() => import("../pages/manager/reports/providers/StationDetails"));

// Manager Reports - TP Reports
// const ManagerViewTP = lazy(() => import("../pages/manager/reports/tp/ViewTP"));
// const ManagerTourProgramDeviation = lazy(() => import("../pages/manager/reports/tp/TourProgramDeviation"));

// Manager Reports - Expense Reports
// const ManagerViewExpense = lazy(() => import("../pages/manager/reports/expense/ViewExpense"));

// Manager Core Operations - Approval Master
// const ManagerMasterData = lazy(() => import("../pages/manager/approval/MasterData"));
// const ManagerApproveTour = lazy(() => import("../pages/manager/approval/ApproveTour"));
const ManagerApproveTourProgram = lazy(() => import("../pages/manager/master/ApproveTourProgram"));
const ManagerFinalizeExpense    = lazy(() => import("../pages/manager/master/FinalizeExpense"));
const MGDCRConsolidate          = lazy(() => import("../pages/manager/report/dcr/MGDCRConsolidate"));
const MGDoctorActivityReport  = lazy(() => import("../pages/manager/report/dcr/MGDoctorActivityReport"));
const MGTeamAttendence          = lazy(() => import("../pages/manager/report/dcr/MGTeamAttendence"));
const MGFinancialYear           = lazy(() => import("../pages/manager/report/dcr/MGFinancialYear"));
const MGMonthlyReport           = lazy(() => import("../pages/manager/report/dcr/MGMonthlyReport"));
const MGCallReport              = lazy(() => import("../pages/manager/report/dcr/MGCallReport"));
const MGViewDoctorChemist       = lazy(() => import("../pages/manager/report/doctorchemiststokiest/MGViewDoctorChemist"));
// Manager Core Operations - Expense
// const ManagerCreateStp = lazy(() => import("../pages/manager/expense/CreateStp"));
// const ManagerSfcDetails = lazy(() => import("../pages/manager/expense/SfcDetails"));

// Manager Resources
// const ManagerHrPolicy = lazy(() => import("../pages/manager/HrPolicy"));


// ─── MR Layout + Pages ──────────────────────────────────────────────────────
const MRLayout   = lazy(() => import("../layouts/MRLayout"));
const MRDashboard = lazy(() => import("../pages/mr/MRDashboard"));

// // MR Reports
const SelfDCRConsolidateReport = lazy(() => import("../pages/mr/reports/daily-call-reports/SelfDCRConsolidateReport"));
const DoctorVisitReport = lazy(() => 
  import("../pages/mr/reports/doctor-chemisst-stockist-reports/DoctorVisitReport")
);

const MRChemistStokistVisitReport = lazy(() => 
  import("../pages/mr/reports/doctor-chemisst-stockist-reports/MRChemistStokistVisitReport")
);

const MRViewDoctorChemist = lazy(() => 
  import("../pages/mr/reports/doctor-chemisst-stockist-reports/MRViewDoctorChemist")
);

const MRMissedDoctorChemist = lazy(() => 
  import("../pages/mr/reports/doctor-chemisst-stockist-reports/MRMissedDoctorChemist")
);

const MRTourProgram = lazy(() => import("../pages/mr/reports/tp-reports/MRTourProgram"));
const MRViewExpenses = lazy(() => import("../pages/mr/reports/expense-reports/MRViewExpenses"));




// // MR Masters
const SubmitDCR = lazy(() => import("../pages/mr/masters/SubmitDCR"));
const MRDoctorChemistCreation = lazy(() => import("../pages/mr/masters/MRDoctorChemistCreation"));
const MRAreaCreation = lazy(() => import("../pages/mr/masters/MRAreaCreation"));
const MRSubmitTourProgram = lazy(() => import("../pages/mr/masters/MRSubmitTourProgram"));

// // MR Expense
const MRSTPCreation = lazy(() => import("../pages/mr/expenses/MRSTPCreation"));


// ─── Loader ──────────────────────────────────────────────────────────────────
function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm font-medium text-slate-500">
      Loading Module...
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<RouteLoader />}>
      {createElement(Component)}
    </Suspense>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"         element={withSuspense(Home)} />
      <Route path="/login"    element={withSuspense(Login)} />
      <Route path="/services" element={withSuspense(Services)} />
      <Route path="/about"    element={withSuspense(About)} />
      <Route path="/contact"  element={withSuspense(Contact)} />

      {/* ════════════════════════════════════════
          ADMIN  (role must be "ADMIN")
      ════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={withSuspense(AdminLayout)}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={withSuspense(AdminDashboard)} />
          <Route path="profile"   element={withSuspense(AdminProfile)} />

          {/* Masters */}
          <Route path="masters/designation"         element={withSuspense(DesignationCreation)} />
          <Route path="masters/users"               element={<Navigate to="directory" replace />} />
          <Route path="masters/users/directory"     element={withSuspense(UserDirectory)} />
          <Route path="masters/users/create"        element={withSuspense(UserCreation)} />
          <Route path="masters/areas"               element={withSuspense(AreaCreation)} />
          <Route path="masters/doctors"             element={withSuspense(DoctorChemistCreation)} />
          <Route path="masters/headquarter-mapping" element={withSuspense(HeadquarterMapping)} />
          <Route path="masters/change-headquarter"  element={withSuspense(ChangeHeadquarter)} />
          <Route path="masters/transfer"            element={withSuspense(MasterDataTransfer)} />
          <Route path="masters/hierarchy-management" element={withSuspense(HierarchyManagement)} />
          <Route path="masters/stp"                 element={withSuspense(STPCreation)} />
          <Route path="masters/product-creation"    element={withSuspense(ProductCreation)} />
          <Route path="masters/crm-mapping"         element={withSuspense(CRMDoctorMapping)} />

          {/* Approvals */}
          <Route path="approvals/master-data"  element={withSuspense(MasterData)} />
          <Route path="approvals/tour-program" element={withSuspense(ApproveTourProgram)} />
          <Route path="approvals/stp"          element={withSuspense(STPApprove)} />

          {/* Expenses */}
          <Route path="expenses/fare-rate-card" element={withSuspense(FareRateCard)} />
          <Route path="expense/statewise-da"    element={<StateWiseDA />} />

          {/* Stock */}
          <Route path="stock/submit-modify"           element={withSuspense(SSSSubmitModify)} />
          <Route path="stock/view"                    element={withSuspense(SSSView)} />
          <Route path="stock/user-stockist-mapping"   element={withSuspense(UserStockistMapping)} />
          <Route path="stock/mapping-deletion-report" element={withSuspense(StockistMappingDeletionReport)} />

          {/* Targets */}
          <Route path="target/submission" element={withSuspense(TargetSubmission)} />
          <Route path="target/modify"     element={withSuspense(TargetModify)} />
          <Route path="target/view"       element={withSuspense(TargetView)} />

          {/* Reports */}
          <Route path="reports/dcr-consolidate" element={withSuspense(DCRConsolidate)} />
          <Route path="reports/dump-dcr"        element={withSuspense(DumpDCRReport)} />

          <Route path="reports/view-provider"      element={withSuspense(ViewProvider)} />
          <Route path="reports/doctor-visit"       element={withSuspense(DoctorVisit)} />
          <Route path="reports/chemist-visit"      element={withSuspense(ChemistStockistVisitReport)} />
          <Route path="reports/missed-provider"    element={withSuspense(MissedProvider)} />
          <Route path="reports/provider-analysis"  element={withSuspense(ProviderVisitAnalysis)} />
          <Route path="reports/consolidated-pob"   element={withSuspense(POBReport)} />
          <Route path="reports/pob-manager-wise" element={withSuspense(POBManagerWise)} />
          <Route path="reports/pob-employee-wise" element={withSuspense(POBEmployeeWise)} />
          <Route path="reports/pob-product-wise" element={withSuspense(POBProductWise)} />
          <Route path="reports/update-provider-status" element={withSuspense(UpdateProviderStatus)} />
          <Route path="reports/speciality-doctor-report" element={withSuspense(SpecialityDoctorReport)} />
          <Route path="reports/speciality-doctor-visit" element={withSuspense(SpecialityDoctorVisit)} />
        </Route>
      </Route>

      {/* ════════════════════════════════════════
          MANAGER  (role must be "MANAGER")
      ════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        <Route path="/manager" element={withSuspense(ManagerLayout)}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={withSuspense(ManagerDashboard)} />
{/*       <Route path="profile"   element={withSuspense(ManagerProfile)} /> */}
{/*                                                                         */}
{/*       <Route path="reports/dcr-consolidate"       element={withSuspense(ManagerDcrConsolidate)} /> */}
{/*       <Route path="reports/team-attendance"       element={withSuspense(ManagerTeamAttendance)} /> */}
{/*       <Route path="reports/financial-yearly-joint" element={withSuspense(ManagerFinancialYearlyJoint)} /> */}
{/*       <Route path="reports/doctor-activity-yearly" element={withSuspense(ManagerDoctorActivityYearly)} /> */}
{/*       <Route path="reports/monthly-summary"       element={withSuspense(ManagerMonthlySummary)} /> */}
{/*       <Route path="reports/call-avg-working"      element={withSuspense(ManagerCallAvgWorking)} /> */}
{/*                                                                         */}
{/*       <Route path="reports/view-doctor-chemist"     element={withSuspense(ManagerViewDoctorChemist)} /> */}
{/*       <Route path="reports/doctor-visit"            element={withSuspense(ManagerDoctorVisit)} /> */}
{/*       <Route path="reports/chemist-stockiest-visit" element={withSuspense(ManagerChemistStockiestVisit)} /> */}
{/*       <Route path="reports/missed-doctor-chemist"   element={withSuspense(ManagerMissedDoctorChemist)} /> */}
{/*       <Route path="reports/station-details"         element={withSuspense(ManagerStationDetails)} /> */}
{/*                                                                         */}
{/*       <Route path="reports/view-tp"                 element={withSuspense(ManagerViewTP)} /> */}
{/*       <Route path="reports/tour-program-deviation"  element={withSuspense(ManagerTourProgramDeviation)} /> */}
{/*                                                                         */}
{/*       <Route path="reports/view-expense"            element={withSuspense(ManagerViewExpense)} /> */}
{/*                                                                         */}
{/*       <Route path="approval/master-data"       element={withSuspense(ManagerMasterData)} /> */}
{/*       <Route path="approval/approve-tour"      element={withSuspense(ManagerApproveTour)} /> */}
          <Route path="approval/approve-tour" element={withSuspense(ManagerApproveTourProgram)} />

{/*       <Route path="approval/sfc-approve"       element={withSuspense(ManagerSfcApprove)} /> */}
          <Route path="approval/finalize-expense"  element={withSuspense(ManagerFinalizeExpense)} />
          <Route path="reports/dcr-consolidate"    element={withSuspense(MGDCRConsolidate)} />
          <Route path="reports/doctor-activity" element={withSuspense(MGDoctorActivityReport)} />
          <Route path="reports/team-attendance"    element={withSuspense(MGTeamAttendence)} />
          <Route path="reports/financial-yearly-joint" element={withSuspense(MGFinancialYear)} />
          <Route path="reports/monthly-report" element={withSuspense(MGMonthlyReport)} />
          <Route path="reports/call-report" element={withSuspense(MGCallReport)} />
          <Route path="reports/view-doctor-chemist" element={withSuspense(MGViewDoctorChemist)} />

{/*                                                                         */}
{/*       <Route path="expense/create-stp" element={withSuspense(ManagerCreateStp)} /> */}
{/*       <Route path="expense/sfc-details" element={withSuspense(ManagerSfcDetails)} /> */}
{/*                                                                         */}
{/*       <Route path="hr-policy" element={withSuspense(ManagerHrPolicy)} /> */}
        </Route>
      </Route>

      {/* ════════════════════════════════════════
          MR  (role must be "MR")
      ════════════════════════════════════════ */}
      <Route element={<ProtectedRoute allowedRoles={["MR"]} />}>
        <Route path="/mr" element={withSuspense(MRLayout)}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={withSuspense(MRDashboard)} />

          <Route path="master/submit-dcr" element={withSuspense(SubmitDCR)} />
          <Route path="master/provider-creation" element={withSuspense(MRDoctorChemistCreation)} />
          <Route path="master/area-creation" element={withSuspense(MRAreaCreation)} />
          <Route path="master/submit-tour-program" element={withSuspense(MRSubmitTourProgram)} />

          <Route path="expense/create-sfc" element={withSuspense(MRSTPCreation)} />

          <Route path="reports/dcr-consolidate" element={withSuspense(SelfDCRConsolidateReport)} />
          <Route path="reports/doctor-visit" element={withSuspense(DoctorVisitReport)} />
          <Route path="reports/chemist-visit" element={withSuspense(MRChemistStokistVisitReport)} />
          <Route path="reports/view-provider" element={withSuspense(MRViewDoctorChemist)} />
          <Route path="reports/missed-provider" element={withSuspense(MRMissedDoctorChemist)} />
          <Route path="reports/tour-program" element={withSuspense(MRTourProgram)} />
          <Route path="reports/view-expenses" element={withSuspense(MRViewExpenses)} />


        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;