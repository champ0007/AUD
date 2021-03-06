﻿using AUDash.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft;
using Newtonsoft.Json;
using AUDash.Repository;
using System.IO;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Net.Mime;
using SendGrid;
using OfficeOpenXml;


namespace AUDash.Controllers
{
    public class DashboardController : ApiController
    {

        DBRepository repo = new DBRepository();

        private string AUTH_TOKEN = "admin-Gu3ssWh@t?";
        private List<string> AUTH_TOKENS = new List<string>() { "admin-Gu3ssWh@t?", "kyla-KyL@dmin" };
        private List<string> ADMIN_AUTH_TOKENS = new List<string>() { "kyla-KyL@dmin" };


        //POST api/Dashboard/UploadCurrentStatus
        [HttpPost]
        public string UploadCurrentStatus(HttpRequestMessage imageData1)
        {
            string message = "";
            try
            {
                //string mailStatusPic = HttpContext.Current.Server.MapPath("..\\..\\Reports\\" + DateTime.Now.ToString("ddMMMyyyy") + "Report.png");
                string imageData = imageData1.Content.ReadAsStringAsync().Result;
                //if (File.Exists(mailStatusPic))
                //{
                //    File.Delete(mailStatusPic);
                //}

                //using (FileStream fs = new FileStream(mailStatusPic, FileMode.Create))
                //{
                //    using (BinaryWriter bw = new BinaryWriter(fs))
                //    {
                //        byte[] data = Convert.FromBase64String(imageData);
                //        bw.Write(data);
                //        bw.Close();
                //    }
                //}

                byte[] d = Convert.FromBase64String(imageData);

                MemoryStream ms = new MemoryStream(d);

                // now send mail to stakeholders
                //string message = SendReport(mailStatusPic);
                message = SendReport(ms);
            }
            catch (Exception e)
            {
                message = "Message: " + e.Message + " \n Inner Exception: " + e.InnerException;
            }
            return message;
        }

        public string GetAuthentication(string authToken)
        {
            string uid = authToken.Split('-').First();
            string pass = authToken.Split('-').Last();
            if (AUTH_TOKENS.Contains(authToken))
                return "true";
            else
                return "false";
        }

        // check if user is admin, if yes, show Consulting Dashboard 
        public string IsUserAdmin(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken) && ADMIN_AUTH_TOKENS.Contains(authToken))
                return "true";
            else
                return "false";
        }
        //GET api/Dashboard/GetDashboardCounts
        public string GetDashboardCounts(string authToken)
        {
            List<string> dashboardCounts = new List<string>();
            if (AUTH_TOKENS.Contains(authToken))
                dashboardCounts = ParseDashboardCounts(repo.GetDashboardCounts());
            return JsonConvert.SerializeObject(dashboardCounts);
        }

        //GET api/Dashboard/GetProjectChartData //Added by Vibhav
        public List<string> GetProjectChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseProjectData(repo.GetReferenceData("Projects"));
            else
                return new List<string>();
        }

        //GET api/Dashboard/GetRevenueChartData //Added by Vibhav
        public List<string> GetRevenueChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseRevenueData(repo.GetReferenceData("Invoices"));
            else
                return new List<string>();
        }

        //GET api/Dashboard/GetTechChartData //Added by Vibhav
        public List<string> GetTechChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseSKillData(repo.GetReferenceData("Projects"));
            else
                return new List<string>();
        }

        //GET api/Dashboard/GetProjChartData //Added by Vibhav
        public List<string> GetProjChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseProjBySkillData(repo.GetReferenceData("Projects"));
            else
                return new List<string>();
        }
        //GET api/GetSoldProposedChartData
        public List<string> GetSoldProposedChartData(string authToken)
        {

            if (AUTH_TOKENS.Contains(authToken))
                return ParseSoldProposedData(repo.GetReferenceData("Projects"));
            //return ParseSoldProposedData(repo.GetReferenceData("Resources"), repo.GetReferenceData("GSSResources"));
            else
                return new List<string>();

        }

        //GET api/Dashboard/GetReferenceData
        public string GetReferenceData(string storageId, string authToken)
        {
            string response = string.Empty;
            if (AUTH_TOKENS.Contains(authToken))
                response = repo.GetReferenceData(storageId);

            return response == string.Empty ? null : response;
        }

        //GET api/Dashboard/GetResourceChartData
        public List<string> GetResourceChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseResourceData(repo.GetReferenceData("GSSResources"));
            else
                return new List<string>();
        }

        //GET api/Dashboard/GetProjectDistributionChartData
        public List<string> GetProjectDistributionChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseProjectDistributionData(repo.GetReferenceData("Projects"));
            else
                return new List<string>();
        }

        //GET api/Dashboard/GetResourceDeploymentChartData
        public List<string> GetResourceDeploymentChartData(string authToken)
        {
            if (AUTH_TOKENS.Contains(authToken))
                return ParseResourceDeploymentChartData(repo.GetReferenceData("ResourceDataCount"));
            else
                return new List<string>();
        }

        //POST api/Dashboard/SetReferenceData
        [HttpPost]
        public void SetReferenceData([FromBody] string referenceData)
        {
            ReferenceData refData = JsonConvert.DeserializeObject<ReferenceData>(referenceData);
            //Set Session Values
            //HttpContext.Current.Session[refData.storageId] = refData.storageData;
            //string sessionvalue = Convert.ToString(HttpContext.Current.Session[refData.storageId]);
            if (refData.authToken.Equals(AUTH_TOKEN))
            {
                repo.SetReferenceData(refData.storageId, refData.storageData);
            }
        }

        //GET api/Dashboard/GetResourceList
        public string GetResourceList(string authToken)
        {
            //List<Resource> Resources = new List<Resource>();
            //Resources.Add(new Resource() { FirstName = "Shakil", LastName = "Shaikh", CurrentProject = "Telstra", ProposedProject = "None", Level = "Manager", AvailableOn = "01-Dec-2014", Skills = "Adobe CQ", StartDate = "01-Mar-2014" });
            //Resources.Add(new Resource() { FirstName = "Shakil", LastName = "Shaikh", CurrentProject = "Telstra", ProposedProject = "None", Level = "Manager", AvailableOn = "01-Dec-2014", Skills = "Adobe CQ", StartDate = "01-Mar-2014" });
            //Resources.Add(new Resource() { FirstName = "Shakil", LastName = "Shaikh", CurrentProject = "Telstra", ProposedProject = "None", Level = "Manager", AvailableOn = "01-Dec-2014", Skills = "Adobe CQ", StartDate = "01-Mar-2014" });
            //Resources.Add(new Resource() { FirstName = "Shakil", LastName = "Shaikh", CurrentProject = "Telstra", ProposedProject = "None", Level = "Manager", AvailableOn = "01-Dec-2014", Skills = "Adobe CQ", StartDate = "01-Mar-2014" });
            //Resources.Add(new Resource() { FirstName = "Shakil", LastName = "Shaikh", CurrentProject = "Telstra", ProposedProject = "None", Level = "Manager", AvailableOn = "01-Dec-2014", Skills = "Adobe CQ", StartDate = "01-Mar-2014" });
            if (AUTH_TOKENS.Contains(authToken))
                return JSONConcat(repo.GetAllResources());
            else
                return string.Empty;
        }

        private string JSONConcat(List<Resource> resourceList)
        {
            string concatString = "[";

            foreach (Resource resource in resourceList)
            {
                //concatString += resource.ResourceData + ",";
                concatString += resource.ResourceData.Replace("{", "{\"ResourceId\":\" " + resource.ResourceId + "\",") + ",";
            }
            concatString = concatString.Substring(0, concatString.Length - 1);
            concatString += "]";

            return concatString;

        }

        //POST api/Dashboard/AddResource
        [HttpPost]
        public void AddResource([FromBody]string resource)
        {

            repo.AddResource(resource);
        }

        //POST api/Dashboard/EditResource
        [HttpPost]
        public void EditResource([FromBody]string resource)
        {
            miniResource resourceData = new miniResource();
            resourceData = JsonConvert.DeserializeObject<miniResource>(resource.Substring(0, resource.IndexOf("\"FirstName")).Replace(",", "}"));
            string editedResourceData = "{" + resource.Substring(resource.IndexOf("\"FirstName"));

            repo.EditResource(resource, resourceData.ResourceId);
        }

        //GET api/Dashboard/GetKeyUpdates
        public string GetKeyUpdates(string authToken)
        {
            List<KeyUpdates> kUpdates = new List<KeyUpdates>();
            if (AUTH_TOKENS.Contains(authToken))
            {
                kUpdates.Add(new KeyUpdates()
                {
                    Heading = "Telstra Client India Visit",
                    Highlights = new List<string>() {
                    "Brendan Devers, Jen Cochrane and Adam Sandler along with Telstra client will be visiting Hyderabad and Mumbai office between 1st Sept and 5th Sept"
                 }
                });

                kUpdates.Add(new KeyUpdates()
                {
                    Heading = " Decisions on AU/DD Testing CoE continue",
                    Highlights = new List<string>() {
                    "Process identified",
                    "Identification of right resources for CoE in progress"
                 }
                });
            }

            return JsonConvert.SerializeObject(kUpdates);

        }

        //POST api/Dashboard/UploadFile
        [HttpPost]
        public void UploadInvoices()
        {
            HttpPostedFile uploadedFile = HttpContext.Current.Request.Files[0];

            List<Invoice> invoices = new List<Invoice>();
            string strError;
            int rowCount = 6;
            //byte[] file =  File.ReadAllBytes(@"C:\invoices.xlsx");
            Stream inputStream = uploadedFile.InputStream;
            using (ExcelPackage package = new ExcelPackage(inputStream))
            {
                if (package.Workbook.Worksheets.Count <= 0)
                    strError = "Your Excel file does not contain any work sheets";
                else
                {
                    ExcelWorksheet invoiceWorkSheet = package.Workbook.Worksheets["EDC Billing & Collections"];
                    while (invoiceWorkSheet.Cells[rowCount, 2].Value != null)
                    {
                        invoices.Add(new Invoice()
                        {
                            Project = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 2].Value),
                            Partner = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 3].Value),
                            Resource = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 4].Value),
                            //Period = Convert.ToDateTime(Convert.ToString(invoiceWorkSheet.Cells[rowCount, 5].Value)).ToString("MMM-yy"),
                            Period = Convert.ToDateTime(Convert.ToString(invoiceWorkSheet.Cells[rowCount, 5].Value)).ToString("MM-dd-yyyy"),
                            Date = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 6].Value),
                            Hours = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 7].Value),
                            Amount = Convert.ToDecimal(invoiceWorkSheet.Cells[rowCount, 8].Value),
                            ATBApproval = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 9].Value),
                            ATBApprovalSentOn = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 10].Value).IndexOf(" ") > 0 ? Convert.ToString(invoiceWorkSheet.Cells[rowCount, 10].Value).Substring(0, Convert.ToString(invoiceWorkSheet.Cells[rowCount, 10].Value).IndexOf(" ")) : Convert.ToString(invoiceWorkSheet.Cells[rowCount, 10].Value),
                            InvoiceRaised = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 11].Value),
                            InvoiceNo = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 12].Value),
                            InvoiceRaisedOn = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 13].Value).IndexOf(" ") > 0 ? Convert.ToString(invoiceWorkSheet.Cells[rowCount, 13].Value).Substring(0, Convert.ToString(invoiceWorkSheet.Cells[rowCount, 13].Value).IndexOf(" ")) : Convert.ToString(invoiceWorkSheet.Cells[rowCount, 13].Value),
                            Comments = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 14].Value),
                            PaymentReceived = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 15].Value),
                            InvoiceId = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 16].Value)
                        });

                        rowCount++;
                    }
                }
            }

            DBRepository repo = new DBRepository();
            repo.SetReferenceData("Invoices", JsonConvert.SerializeObject(invoices));
        }

        public void UploadResources()
        {
            HttpPostedFile uploadedFile = HttpContext.Current.Request.Files[0];
            //byte[] file = File.ReadAllBytes(@"C:\Availability Report - USI TAB.xlsx");

            List<ResourceEntity> resources = new List<ResourceEntity>();
            string strError;
            int rowCount = 5;
            //MemoryStream ms = new MemoryStream(file);

            Stream inputStream = uploadedFile.InputStream;

            using (ExcelPackage package = new ExcelPackage(inputStream))
            {
                if (package.Workbook.Worksheets.Count <= 0)
                    strError = "Your Excel file does not contain any work sheets";
                else
                {
                    ExcelWorksheet resourceWorkSheet = package.Workbook.Worksheets.Where(x => x.Name.Contains("US-I") || x.Name.Contains("USI")).First();
                    while (resourceWorkSheet.Cells[rowCount, 1].Value != null)
                    {
                        resources.Add(new ResourceEntity()
                        {
                            FirstName = Convert.ToString(resourceWorkSheet.Cells[rowCount, 1].Value).Split(',')[1].Trim(),
                            LastName = Convert.ToString(resourceWorkSheet.Cells[rowCount, 1].Value).Split(',')[0].Trim(),
                            EmpId = Convert.ToString(resourceWorkSheet.Cells[rowCount, 2].Value),
                            Skills = Convert.ToString(resourceWorkSheet.Cells[rowCount, 3].Value),
                            Level = Convert.ToString(resourceWorkSheet.Cells[rowCount, 6].Value),
                            LastProject = String.Empty,
                            CurrentProject = ParseProject(Convert.ToString(resourceWorkSheet.Cells[rowCount, 19].Value)),
                            NextProject = ParseProject(Convert.ToString(resourceWorkSheet.Cells[rowCount, 20].Value)),
                            ProposedStartDate = ParseProposedProject(Convert.ToString(resourceWorkSheet.Cells[rowCount, 20].Value), "StartDate"),
                            ProposedEndDate = ParseProposedProject(Convert.ToString(resourceWorkSheet.Cells[rowCount, 20].Value), "EndDate"),
                            AvailableOn = Convert.ToString(resourceWorkSheet.Cells[rowCount, 21].Value).Split(' ')[0]
                        });

                        rowCount++;
                    }
                }
            }

            DBRepository repo = new DBRepository();
            repo.SetReferenceData("GSSResources", JsonConvert.SerializeObject(resources));
            repo.SetReferenceData("ResourceDataCount", GetResourceDataCount(resources.Count(), DateTime.Now.ToString("MMMyy")));
        }

        [HttpPost]
        public void UploadInvoiceFiles()
        {
            HttpPostedFile uploadedFile = HttpContext.Current.Request.Files[0];
            try
            {
                uint filename = Convert.ToUInt32(uploadedFile.FileName.Remove(uploadedFile.FileName.IndexOf(".")));
                byte[] file;
                using (var stream = uploadedFile.InputStream)
                {
                    using (var reader = new BinaryReader(stream))
                    {
                        file = reader.ReadBytes((int)stream.Length);
                        repo.InsertInvoiceFile(file, filename.ToString());
                    }
                }
            }
            catch (Exception ex) { }


        }

        //POST api/Dashboard/UpsertProject
        [HttpPost]
        public string UpsertProject([FromBody]ProjectRequest projectRequest)
        {
            if (projectRequest.action == RequestedAction.Delete)
            {
                int index = projectRequest.Projects.FindIndex(x => x.Id == projectRequest.Project.Id);
                projectRequest.Projects.RemoveAt(index);
            }
            else if (projectRequest.action == RequestedAction.Upsert)
            {
                if (projectRequest.Project.Id == null)
                {
                    projectRequest.Project.Id = DateTime.Now.ToString("dMyyHHmmss");
                    projectRequest.Projects.Add(projectRequest.Project);
                }
                else
                {
                    int index = projectRequest.Projects.FindIndex(x => x.Id == projectRequest.Project.Id);
                    if (index >= 0)
                    {
                        projectRequest.Projects[index] = projectRequest.Project;
                    }
                }
            }

            repo.SetReferenceData("Projects", JsonConvert.SerializeObject(projectRequest.Projects));

            return repo.GetReferenceData("Projects");
        }


        //POST api/Dashboard/UpsertResource
        [HttpPost]
        public string UpsertResource([FromBody]ResourceRequest resourceRequest)
        {

            if (resourceRequest.Action == RequestedAction.Delete)
            {
                int index = resourceRequest.Resources.FindIndex(x => x.Id == resourceRequest.Resource.Id);
                resourceRequest.Resources.RemoveAt(index);
            }
            else if (resourceRequest.Action == RequestedAction.Upsert)
            {
                if (resourceRequest.Resource.Id == null)
                {
                    resourceRequest.Resource.Id = DateTime.Now.ToString("dMyyHHmmss");
                    resourceRequest.Resources.Add(resourceRequest.Resource);
                }
                else
                {
                    int index = resourceRequest.Resources.FindIndex(x => x.Id == resourceRequest.Resource.Id);
                    if (index >= 0)
                    {
                        resourceRequest.Resources[index] = resourceRequest.Resource;
                    }
                }
            }

            repo.SetReferenceData("Resources", JsonConvert.SerializeObject(resourceRequest.Resources));

            return repo.GetReferenceData("Resources");
        }

        //POST api/Dashboard/UpsertInvoice
        [HttpPost]
        public string UpsertInvoice([FromBody]InvoiceRequest invoiceRequest)
        {
            if (invoiceRequest.action == RequestedAction.Delete)
            {
                int index = invoiceRequest.Invoices.FindIndex(x => x.InvoiceId == invoiceRequest.InvoiceEntity.InvoiceId);
                invoiceRequest.Invoices.RemoveAt(index);
            }
            else if (invoiceRequest.action == RequestedAction.Upsert)
            {
                if (invoiceRequest.InvoiceEntity.InvoiceId == null)
                {
                    invoiceRequest.InvoiceEntity.InvoiceId = DateTime.Now.ToString("dMyyHHmmss");
                    invoiceRequest.Invoices.Add(invoiceRequest.InvoiceEntity);
                }
                else
                {
                    int index = invoiceRequest.Invoices.FindIndex(x => x.InvoiceId == invoiceRequest.InvoiceEntity.InvoiceId);
                    if (index >= 0)
                    {
                        invoiceRequest.Invoices[index] = invoiceRequest.InvoiceEntity;
                    }
                }
            }

            repo.SetReferenceData("Invoices", JsonConvert.SerializeObject(invoiceRequest.Invoices));

            return repo.GetReferenceData("Invoices");
        }


        public HttpResponseMessage GetInvoiceFile()
        {
            HttpResponseMessage result = null;
            try
            {
                IEnumerable<string> headerValues = Request.Headers.GetValues("fileID");
                string invoiceNo = headerValues.First();

                if (invoiceNo == "All")
                {

                    MemoryStream invoiceMS = new MemoryStream();
                    List<Invoice> invoices = JsonConvert.DeserializeObject<List<Invoice>>(repo.GetReferenceData("Invoices"));
                    using (ExcelPackage pck = new ExcelPackage(new FileInfo("Invoices")))
                    {
                        ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Invoices");
                        ws.Cells["A1"].LoadFromCollection<Invoice>(invoices, true);
                        pck.SaveAs(invoiceMS);

                        result = Request.CreateResponse(HttpStatusCode.OK);
                        invoiceMS.Seek(0, SeekOrigin.Begin);
                        result.Content = new StreamContent(invoiceMS);
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/xls");
                        result.Content.Headers.Add("x-filename", "Invoices.xls");
                        result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                        result.Content.Headers.ContentDisposition.FileName = "Invoices.xls";
                    }
                }
                else
                {
                    MemoryStream invoiceMS = repo.GetInvoiceFile(invoiceNo);
                    if (invoiceMS.Length > 0)
                    {
                        result = Request.CreateResponse(HttpStatusCode.OK);
                        invoiceMS.Seek(0, SeekOrigin.Begin);
                        result.Content = new StreamContent(invoiceMS);
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                        result.Content.Headers.Add("x-filename", invoiceNo.ToString() + ".pdf");
                        result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                        result.Content.Headers.ContentDisposition.FileName = invoiceNo.ToString();
                    }
                }
                return result;
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        private string GetResourceDataCount(int resourceCount, string currentDate)
        {
            int currentFY = GetFiscalYear();
            string currentFiscalYear = currentFY.ToString().Substring(2, 2);
            string nextYear = Convert.ToString(currentFY + 1).Substring(2, 2);

            Dictionary<string, int> resourceMonths = new Dictionary<string, int>();
            resourceMonths.Add(ChartMonths.Apr.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.May.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Jun.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Jul.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Aug.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Sep.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Oct.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Nov.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Dec.ToString() + currentFiscalYear, 0);
            resourceMonths.Add(ChartMonths.Jan.ToString() + nextYear, 0);
            resourceMonths.Add(ChartMonths.Feb.ToString() + nextYear, 0);
            resourceMonths.Add(ChartMonths.Mar.ToString() + nextYear, 0);

            string serializedObject = JsonConvert.SerializeObject(resourceMonths);
            string savedData = repo.GetReferenceData("ResourceDataCount");
            Dictionary<string, int> SavedCollection = JsonConvert.DeserializeObject<Dictionary<string, int>>(savedData);
            Dictionary<string, int> updatedCollection = JsonConvert.DeserializeObject<Dictionary<string, int>>(serializedObject);

            foreach (KeyValuePair<string, int> entry in resourceMonths)
            {
                if (SavedCollection.ContainsKey(entry.Key))
                {
                    updatedCollection[entry.Key] = SavedCollection[entry.Key];
                }
            }

            if (updatedCollection.ContainsKey(currentDate))
            {
                updatedCollection[currentDate] = resourceCount;
            }

            return JsonConvert.SerializeObject(updatedCollection);

        }

        private List<string> ParseResourceData(string resourceData)
        {
            List<string> Projects = new List<string>();

            List<ResourceEntity> resources = JsonConvert.DeserializeObject<List<ResourceEntity>>(resourceData);

            Projects = resources.Select(x => x.CurrentProject).ToList();

            List<GroupedProject> GroupedProjects = Projects
                .GroupBy(s => s)
                .Select(group => new GroupedProject() { Project = group.Key, Count = group.Count() }).ToList();

            List<string> chartLabelsb = new List<string>();
            List<int> chartDatab = new List<int>();

            foreach (GroupedProject pro in GroupedProjects)
            {
                chartLabelsb.Add(pro.Project);
                chartDatab.Add(pro.Count);
            }

            List<string> returnList = new List<string>();
            returnList.Add(JsonConvert.SerializeObject(chartLabelsb));
            returnList.Add(JsonConvert.SerializeObject(chartDatab));

            return returnList;

        }

        //Added by Vibhav. Create chart data from data row
        private List<string> ParseProjectData(string projectData)
        {
            List<string> Projects = new List<string>();
            List<ProjectEntity> projs = JsonConvert.DeserializeObject<List<ProjectEntity>>(projectData);

            foreach (ProjectEntity p in projs)
            {
                Projects.Add(p.Stage);
            }

            List<ProjGroupedByStatus> GroupedProjects = Projects
                .GroupBy(s => s)
                .Select(group => new ProjGroupedByStatus() { ProjectStatus = group.Key, Count = group.Count() }).ToList();
            List<string> chartLabelsb = new List<string>();
            List<int> chartDatab = new List<int>();

            foreach (ProjGroupedByStatus pro in GroupedProjects)
            {
                chartLabelsb.Add(pro.ProjectStatus);
                chartDatab.Add(pro.Count);
            }

            List<string> returnList = new List<string>();
            returnList.Add(JsonConvert.SerializeObject(chartLabelsb));
            returnList.Add(JsonConvert.SerializeObject(chartDatab));

            return returnList;

        }

        private List<string> ParseSoldProposedData(string projects)
        {
            List<ProjectEntity> projs = JsonConvert.DeserializeObject<List<ProjectEntity>>(projects);

            Dictionary<string, int> soldProjects = new Dictionary<string, int>();
            soldProjects.Add(((ChartMonths)DateTime.Now.Month).ToString() + DateTime.Now.Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(1).Month).ToString() + DateTime.Now.AddMonths(1).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(2).Month).ToString() + DateTime.Now.AddMonths(2).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(3).Month).ToString() + DateTime.Now.AddMonths(3).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(4).Month).ToString() + DateTime.Now.AddMonths(4).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(5).Month).ToString() + DateTime.Now.AddMonths(5).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(6).Month).ToString() + DateTime.Now.AddMonths(6).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(7).Month).ToString() + DateTime.Now.AddMonths(7).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(8).Month).ToString() + DateTime.Now.AddMonths(8).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(9).Month).ToString() + DateTime.Now.AddMonths(9).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(10).Month).ToString() + DateTime.Now.AddMonths(10).Year.ToString().Substring(2, 2), 0);
            soldProjects.Add(((ChartMonths)DateTime.Now.AddMonths(11).Month).ToString() + DateTime.Now.AddMonths(11).Year.ToString().Substring(2, 2), 0);


            Dictionary<string, int> proposedProjects = new Dictionary<string, int>();

            proposedProjects.Add(((ChartMonths)DateTime.Now.Month).ToString() + DateTime.Now.Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(1).Month).ToString() + DateTime.Now.AddMonths(1).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(2).Month).ToString() + DateTime.Now.AddMonths(2).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(3).Month).ToString() + DateTime.Now.AddMonths(3).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(4).Month).ToString() + DateTime.Now.AddMonths(4).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(5).Month).ToString() + DateTime.Now.AddMonths(5).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(6).Month).ToString() + DateTime.Now.AddMonths(6).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(7).Month).ToString() + DateTime.Now.AddMonths(7).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(8).Month).ToString() + DateTime.Now.AddMonths(8).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(9).Month).ToString() + DateTime.Now.AddMonths(9).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(10).Month).ToString() + DateTime.Now.AddMonths(10).Year.ToString().Substring(2, 2), 0);
            proposedProjects.Add(((ChartMonths)DateTime.Now.AddMonths(11).Month).ToString() + DateTime.Now.AddMonths(11).Year.ToString().Substring(2, 2), 0);

            foreach (ProjectEntity project in projs)
            {
                if (ParseProjectStatus(project.Stage) == "Sold")
                {

                    PopulateProjects(soldProjects, project, ProjectAttribute.Resources);
                    PopulateProjects(proposedProjects, project, ProjectAttribute.Resources);
                }
                else
                {
                    PopulateProjects(proposedProjects, project, ProjectAttribute.Resources);
                }
            }

            List<string> chartData = new List<string>();

            chartData.Add(JsonConvert.SerializeObject(soldProjects.Keys.ToList<string>()));
            chartData.Add(JsonConvert.SerializeObject(soldProjects.Values.ToList<int>()));
            chartData.Add(JsonConvert.SerializeObject(proposedProjects.Values.ToList<int>()));

            return chartData;

        }

        private string ParseProjectStatus(string projectStage)
        {
            string projectStatus = string.Empty;

            switch (projectStage)
            {
                case "Contacted":
                    projectStatus = "Proposed";
                    break;
                case "Qualified":
                    projectStatus = "Proposed";
                    break;
                case "Proposal":
                    projectStatus = "Proposed";
                    break;
                case "Verbal Commit":
                    projectStatus = "Proposed";
                    break;
                case "Sold":
                    projectStatus = "Sold";
                    break;
                case "Design":
                    projectStatus = "Sold";
                    break;
                case "Development":
                    projectStatus = "Sold";
                    break;
                case "UAT":
                    projectStatus = "Sold";
                    break;
                case "Completed":
                    projectStatus = "Completed";
                    break;
                case "Abandoned / Lost":
                    projectStatus = "Lost";
                    break;
            }

            return projectStatus;

        }


        private static void PopulateProjects(Dictionary<string, int> projects, ProjectEntity project, ProjectAttribute attribute)
        {
            int incrementedAttribute = 0;

            if (attribute.Equals(ProjectAttribute.Resources))
            {
                incrementedAttribute = Convert.ToInt32(project.TotalResources);
            }
            else if (attribute.Equals(ProjectAttribute.Project))
            {
                incrementedAttribute = 1;

            }

            for (DateTime projectDate = Convert.ToDateTime(project.StartDate); projectDate <= Convert.ToDateTime(project.EndDate); projectDate = projectDate.AddMonths(1))
            {
                if (projects.ContainsKey(((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)))
                {
                    projects[((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)] += incrementedAttribute;
                }
            }
        }

        private static void PopulateEntity(Dictionary<string, int> resources, ResourcesGroupedByMonth resource)
        {
            int incrementedAttribute = 0;

            incrementedAttribute = Convert.ToInt32(resource.Count);

            for (DateTime projectDate = DateTime.Now; projectDate <= Convert.ToDateTime(ParseMonthYear(resource.Month)); projectDate = projectDate.AddMonths(1))
            {
                if (resources.ContainsKey(((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)))
                {
                    resources[((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)] += incrementedAttribute;
                }
            }
        }

        private static void PopulateUnallocatedEntity(Dictionary<string, int> resources, UnallocatedResourceEntity resource)
        {
            int incrementedAttribute = 1;

            for (DateTime projectDate = Convert.ToDateTime(resource.RequiredFrom); projectDate <= Convert.ToDateTime(resource.RequiredTill); projectDate = projectDate.AddMonths(1))
            {
                if (resources.ContainsKey(((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)))
                {
                    resources[((ChartMonths)projectDate.Month).ToString() + projectDate.Year.ToString().Substring(2, 2)] += incrementedAttribute;
                }
            }
        }

        private List<string> ParseProjectDistributionData(string projects)
        {
            int currentFY = GetFiscalYear();
            string currentFiscalYear = currentFY.ToString().Substring(2, 2);
            string nextYear = Convert.ToString(currentFY + 1).Substring(2, 2);

            List<ProjectEntity> projs = JsonConvert.DeserializeObject<List<ProjectEntity>>(projects);

            Dictionary<string, int> totalProjects = new Dictionary<string, int>();
            totalProjects.Add(ChartMonths.Apr.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.May.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Jun.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Jul.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Aug.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Sep.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Oct.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Nov.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Dec.ToString() + currentFiscalYear, 0);
            totalProjects.Add(ChartMonths.Jan.ToString() + nextYear, 0);
            totalProjects.Add(ChartMonths.Feb.ToString() + nextYear, 0);
            totalProjects.Add(ChartMonths.Mar.ToString() + nextYear, 0);

            foreach (ProjectEntity project in projs)
            {
                if (ParseProjectStatus(project.Stage) == "Sold")
                {
                    PopulateProjects(totalProjects, project, ProjectAttribute.Project);
                }
            }

            List<string> chartData = new List<string>();


            chartData.Add(JsonConvert.SerializeObject(totalProjects.Keys.ToList<string>()));
            chartData.Add(JsonConvert.SerializeObject(totalProjects.Values.ToList<int>()));

            return chartData;


        }

        private int GetFiscalYear()
        {
            return (DateTime.Now.Month >= 4 ? DateTime.Now.Year : (DateTime.Now.Year - 1));
        }

        private List<string> ParseSKillData(string skillData)
        {
            List<ProjectEntity> projs = JsonConvert.DeserializeObject<List<ProjectEntity>>(skillData);

            List<ResourceBySkill> resourceList = projs.Where(p => p.Stage == "Sold").GroupBy(e => e.Technology)
               .Select(ls => new ResourceBySkill()
               {
                   label = ls.Key,
                   value = ls.Sum(w => Convert.ToInt32(w.TotalResources))
               }).ToList();

            //foreach (var data in resourceList)
            //{
            //    data.color = "";
            //}

            List<string> returnList = new List<string>();

            returnList.Add(JsonConvert.SerializeObject(resourceList));

            return returnList;

        }

        //Added by Vibhav. 
        private List<string> ParseProjBySkillData(string projectData)
        {
            List<string> Projects = new List<string>();
            List<ProjectEntity> projs = JsonConvert.DeserializeObject<List<ProjectEntity>>(projectData);

            foreach (ProjectEntity p in projs)
            {
                Projects.Add(p.Technology);
            }

            List<ProjGroupedByStatus> GroupedProjects = Projects
                .GroupBy(s => s)
                .Select(group => new ProjGroupedByStatus() { ProjectStatus = group.Key, Count = group.Count() }).ToList();

            //foreach (var data in resourceList)
            //{
            //    data.color = "";
            //}

            List<string> returnList = new List<string>();

            returnList.Add(JsonConvert.SerializeObject(GroupedProjects));

            return returnList;

        }

        private List<string> ParseDashboardCounts(Dictionary<string, string> dashboardData)
        {
            List<string> dashboardCounts = new List<string>();

            dashboardCounts.Add(JsonConvert.DeserializeObject<List<Invoice>>(dashboardData["Invoices"]).Where(x => x.PaymentReceived == "Pending").Count().ToString());
            dashboardCounts.Add(JsonConvert.DeserializeObject<List<ProjectEntity>>(dashboardData["Projects"]).Where(x => x.Stage == "Sold").Count().ToString());
            dashboardCounts.Add(JsonConvert.DeserializeObject<List<ActionItem>>(dashboardData["NewToDoItems"]).Where(x => x.Status == "Open").Count().ToString());
            dashboardCounts.Add(JsonConvert.DeserializeObject<List<ResourceEntity>>(dashboardData["GSSResources"]).Count.ToString());

            return dashboardCounts;

        }

        private string ParseProject(string currentProject)
        {
            string cProject = string.Empty;

            if (currentProject.IndexOf(",") > 0)
            {

                foreach (string project in currentProject.Split(','))
                {
                    if (project.Contains("AU"))
                    {
                        cProject = project.Split('(')[0].Trim().Split('_')[0];
                    }
                }

            }
            else
            {
                if (currentProject.Contains("AU"))
                {
                    cProject = currentProject.Split('(')[0].Trim().Split('_')[0];
                }

            }

            return cProject;
        }

        private List<string> ParseResourceDeploymentChartData(string ResourceDataCount)
        {
            List<string> returnList = new List<string>();

            Dictionary<string, int> SavedCollection = JsonConvert.DeserializeObject<Dictionary<string, int>>(ResourceDataCount);

            returnList.Add(JsonConvert.SerializeObject(SavedCollection.Keys.ToList<string>()));
            returnList.Add(JsonConvert.SerializeObject(SavedCollection.Values.ToList<int>()));

            return returnList;

        }


        private List<string> ParseSoldProposedData(string resources, string GSSresources)
        {
            List<ResourceEntity> gssResources = JsonConvert.DeserializeObject<List<ResourceEntity>>(GSSresources);
            List<UnallocatedResourceEntity> unallocatedResources = JsonConvert.DeserializeObject<List<UnallocatedResourceEntity>>(resources);
            List<ProjectEntity> projects = JsonConvert.DeserializeObject<List<ProjectEntity>>(repo.GetReferenceData("Projects"));

            List<ResourcesGroupedByMonth> GroupedGssResources = gssResources
                .Where(s => s.AvailableOn != string.Empty)
                .GroupBy(s => Convert.ToDateTime(s.AvailableOn).ToString("MMMyy"))
                .Select(group => new ResourcesGroupedByMonth() { Month = group.Key, Count = group.Count() }).ToList();

            List<UnallocatedResourceEntity> ProposedGssResources = gssResources
                .Where(s => s.AvailableOn == string.Empty && s.CurrentProject == string.Empty && s.NextProject != string.Empty)
                .Select(s => new UnallocatedResourceEntity() { RequiredFrom = s.ProposedStartDate, RequiredTill = s.ProposedEndDate }).ToList();

            //List<ResourcesGroupedByMonth> GroupedUnallocatedResources = unallocatedResources
            //    .GroupBy(s => Convert.ToDateTime(s.RequiredFrom).ToString("MMMyy"))
            //    .Select(group => new ResourcesGroupedByMonth() { Month = group.Key, Count = group.Count() }).ToList();

            Dictionary<string, int> soldEntity = new Dictionary<string, int>();
            soldEntity.Add(((ChartMonths)DateTime.Now.Month).ToString() + DateTime.Now.Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(1).Month).ToString() + DateTime.Now.AddMonths(1).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(2).Month).ToString() + DateTime.Now.AddMonths(2).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(3).Month).ToString() + DateTime.Now.AddMonths(3).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(4).Month).ToString() + DateTime.Now.AddMonths(4).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(5).Month).ToString() + DateTime.Now.AddMonths(5).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(6).Month).ToString() + DateTime.Now.AddMonths(6).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(7).Month).ToString() + DateTime.Now.AddMonths(7).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(8).Month).ToString() + DateTime.Now.AddMonths(8).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(9).Month).ToString() + DateTime.Now.AddMonths(9).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(10).Month).ToString() + DateTime.Now.AddMonths(10).Year.ToString().Substring(2, 2), 0);
            soldEntity.Add(((ChartMonths)DateTime.Now.AddMonths(11).Month).ToString() + DateTime.Now.AddMonths(11).Year.ToString().Substring(2, 2), 0);


            Dictionary<string, int> proposedEntity = new Dictionary<string, int>();

            proposedEntity.Add(((ChartMonths)DateTime.Now.Month).ToString() + DateTime.Now.Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(1).Month).ToString() + DateTime.Now.AddMonths(1).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(2).Month).ToString() + DateTime.Now.AddMonths(2).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(3).Month).ToString() + DateTime.Now.AddMonths(3).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(4).Month).ToString() + DateTime.Now.AddMonths(4).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(5).Month).ToString() + DateTime.Now.AddMonths(5).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(6).Month).ToString() + DateTime.Now.AddMonths(6).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(7).Month).ToString() + DateTime.Now.AddMonths(7).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(8).Month).ToString() + DateTime.Now.AddMonths(8).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(9).Month).ToString() + DateTime.Now.AddMonths(9).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(10).Month).ToString() + DateTime.Now.AddMonths(10).Year.ToString().Substring(2, 2), 0);
            proposedEntity.Add(((ChartMonths)DateTime.Now.AddMonths(11).Month).ToString() + DateTime.Now.AddMonths(11).Year.ToString().Substring(2, 2), 0);

            foreach (ResourcesGroupedByMonth resource in GroupedGssResources)
            {
                PopulateEntity(soldEntity, resource);
                PopulateEntity(proposedEntity, resource);
            }

            foreach (UnallocatedResourceEntity unallocatedResource in unallocatedResources)
            {
                PopulateUnallocatedEntity(proposedEntity, unallocatedResource);
            }

            foreach (UnallocatedResourceEntity unallocatedResource in ProposedGssResources)
            {
                PopulateUnallocatedEntity(proposedEntity, unallocatedResource);
            }

            List<string> chartData = new List<string>();

            chartData.Add(JsonConvert.SerializeObject(soldEntity.Keys.ToList<string>()));
            chartData.Add(JsonConvert.SerializeObject(soldEntity.Values.ToList<int>()));
            chartData.Add(JsonConvert.SerializeObject(proposedEntity.Values.ToList<int>()));

            return chartData;

        }

        private static string ParseMonthYear(string MMMyy)
        {
            string output = MMMyy.Substring(0, 3) + (Convert.ToInt32(MMMyy.Substring(3, 2)) + 2000).ToString();


            return output;

        }

        private List<string> ParseRevenueData(string invoiceData)
        {
            List<Invoice> invoices = JsonConvert.DeserializeObject<List<Invoice>>(invoiceData);
            List<Invoice> relevantCurrentInvoices = new List<Invoice>();
            List<Invoice> relevantPreviousInvoices = new List<Invoice>();

            int currentFY = GetFiscalYear();
            string currentFiscalYear = currentFY.ToString().Substring(2, 2);
            string nextYear = Convert.ToString(currentFY + 1).Substring(2, 2);
            string previousYear = Convert.ToString(currentFY - 1).Substring(2, 2);

            Dictionary<string, int> previousRevenueMonths = new Dictionary<string, int>();
            previousRevenueMonths.Add(ChartMonths.Apr.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.May.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Jun.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Jul.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Aug.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Sep.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Oct.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Nov.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Dec.ToString() + "-" + previousYear, 0);
            previousRevenueMonths.Add(ChartMonths.Jan.ToString() + "-" + currentFiscalYear, 0);
            previousRevenueMonths.Add(ChartMonths.Feb.ToString() + "-" + currentFiscalYear, 0);
            previousRevenueMonths.Add(ChartMonths.Mar.ToString() + "-" + currentFiscalYear, 0);

            Dictionary<string, int> currentRevenueMonths = new Dictionary<string, int>();
            currentRevenueMonths.Add(ChartMonths.Apr.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.May.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Jun.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Jul.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Aug.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Sep.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Oct.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Nov.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Dec.ToString() + "-" + currentFiscalYear, 0);
            currentRevenueMonths.Add(ChartMonths.Jan.ToString() + "-" + nextYear, 0);
            currentRevenueMonths.Add(ChartMonths.Feb.ToString() + "-" + nextYear, 0);
            currentRevenueMonths.Add(ChartMonths.Mar.ToString() + "-" + nextYear, 0);


            relevantCurrentInvoices = invoices.FindAll(e => currentRevenueMonths.ContainsKey(Convert.ToDateTime(e.Period).ToString("MMM-yy")));
            decimal sumCurrentYear = relevantCurrentInvoices.Sum(e => e.Amount);

            relevantPreviousInvoices = invoices.FindAll(e => previousRevenueMonths.ContainsKey(Convert.ToDateTime(e.Period).ToString("MMM-yy")));
            decimal sumPreviousYear = relevantPreviousInvoices.Sum(e => e.Amount);

            List<string> returnList = new List<string>();

            string currFY = "FY" + (currentFY).ToString().Substring(2, 2);
            string prevFY = "FY" + (currentFY - 1).ToString().Substring(2, 2);

            //send current year data
            returnList.Add(JsonConvert.SerializeObject(relevantCurrentInvoices.Select(x => x.Amount)));
            //send previous year data
            returnList.Add(JsonConvert.SerializeObject(relevantPreviousInvoices.Select(x => x.Amount)));
            //send current, prev year FY
            returnList.Add(JsonConvert.SerializeObject(currFY));
            returnList.Add(JsonConvert.SerializeObject(prevFY));
            returnList.Add(JsonConvert.SerializeObject(new List<string> { sumPreviousYear.ToString(), sumCurrentYear.ToString() }));
            returnList.Add(JsonConvert.SerializeObject(new List<string> { prevFY, currFY }));
            return returnList;

        }

        private string ParseProposedProject(string proposedProject, string dateType)
        {
            DateTime proposedDate = DateTime.Now;

            if (proposedProject.IndexOf(",") > 0)
            {

                foreach (string project in proposedProject.Split(','))
                {
                    if (project.Contains("AU") && project.Contains('-') && project.Contains('('))
                    {
                        if (dateType == "StartDate")
                        {
                            proposedDate = Convert.ToDateTime(project.Split('(')[1].Trim().Split('-')[0]);
                        }
                        else
                        {
                            proposedDate = Convert.ToDateTime(project.Split('(')[1].Trim().Split('-')[1].TrimEnd(')'));
                        }
                    }
                }

            }
            else
            {
                if (proposedProject.Contains("AU") && proposedProject.Contains('-') && proposedProject.Contains('('))
                {
                    if (dateType == "StartDate")
                    {
                        proposedDate = Convert.ToDateTime(proposedProject.Split('(')[1].Trim().Split('-')[0]);
                    }
                    else
                    {
                        proposedDate = Convert.ToDateTime(proposedProject.Split('(')[1].Trim().Split('-')[1].TrimEnd(')'));
                    }
                }

            }

            return proposedDate.ToString();



        }

        // Method to send mail
        private string SendReport(Stream path)
        {

            // Create the email object first, then add the properties.
            SendGridMessage myMessage = new SendGridMessage();

            //string img = @"C:\\logo.png";
            //ContentType ctype = new ContentType("image/png");
            //var attachment = new Attachment(img, ctype);
            //var linkedResource = new LinkedResource(img, ctype);
            //myMessage.AddAttachment(attachment.ContentStream, attachment.Name);
            //myMessage.EmbedImage(attachment.Name, linkedResource.ContentId);


            //string html = "<img src=cid:" + linkedResource.ContentId + " />";
            //myMessage.Html = html;
            myMessage.AddTo("tusharma@deloitte.com");
            myMessage.From = new MailAddress("tusharma@deloitte.com", "Tushar");
            myMessage.Subject = "AUDashboard Weekly Report";

            LinkedResource logo = new LinkedResource(path);
            logo.ContentId = "DashboardStatus";

            //Html formatting for showing image
            string htmlContent = "<html><body><img src=cid:DashboardStatus></body></html>";
            myMessage.Html = htmlContent;
            myMessage.EmbedStreamImage(path, "DashboardStatus");
            //myMessage.AlternateViews.Add(av1);
            //av1.LinkedResources.Add(logo);

            // Create credentials, specifying your user name and password.
            var credentials = new NetworkCredential("azure_caba571c232c5241814931d615e146a9@azure.com", "Gu3ssWh@t?");

            // Create an Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email, which returns an awaitable task.
            transportWeb.DeliverAsync(myMessage);

            return "Mail sent";

            // If developing a Console Application, use the following
            // transportWeb.DeliverAsync(mail).Wait();


            //string fromaddr = "audashboardtest@gmail.com";
            //string toaddr = "tusharma@deloitte.com";//"vibs.dy@gmail.com";
            //string password = "D@shbo@rd";
            //string message = "";
            //try
            //{
            //    MailMessage msg = new MailMessage();
            //    msg.Subject = "AUDashboard Weekly Report";
            //    //LinkedResource logo = new LinkedResource(path, "image/png");
            //    LinkedResource logo = new LinkedResource(path);
            //    logo.ContentId = "DashboardStatus";

            //    //Html formatting for showing image
            //    AlternateView av1 = AlternateView.CreateAlternateViewFromString("<html><body>"
            //        + "<img src=cid:DashboardStatus></body></html>", null, MediaTypeNames.Text.Html);

            //    msg.AlternateViews.Add(av1);
            //    av1.LinkedResources.Add(logo);
            //    msg.IsBodyHtml = true;
            //    msg.From = new MailAddress(fromaddr);
            //    msg.To.Add(new MailAddress(toaddr));
            //    SmtpClient smtp = new SmtpClient();
            //    smtp.Host = "smtp.gmail.com";
            //    smtp.Port = 587;// 465;
            //    //smtp.UseDefaultCredentials = false;
            //    smtp.EnableSsl = true;
            //    NetworkCredential nc = new NetworkCredential(fromaddr, password);
            //    smtp.Credentials = nc;
            //    smtp.Send(msg);
            //    message = "mail sent.";
            //}
            //catch (Exception e)
            //{
            //    message = "Message: " + e.Message + " \n Inner Exception: " + e.InnerException;
            //}

        }


        //POST api/Dashboard/UploadConsultingReport
        [HttpPost]
        public void UploadConsultingReport()
        {
            DBRepository repo = new DBRepository();

            HttpPostedFile uploadedFile = HttpContext.Current.Request.Files[0];

            List<FXMaster> FXrates = new List<FXMaster>();
            FXrates = repo.GetFXRates();
            List<ClusterWBSMapping> clusterMapper = new List<ClusterWBSMapping>();
            clusterMapper = repo.GetClusterMapping();
            List<InvoiceEntity> invoices = new List<InvoiceEntity>();
            string strError;
            int rowCount = 4;
            Stream inputStream = uploadedFile.InputStream;
            using (ExcelPackage package = new ExcelPackage(inputStream))
            {
                ExcelWorksheet invoiceWorkSheet;

                try
                {
                    invoiceWorkSheet = package.Workbook.Worksheets["All Functions"];
                }
                catch
                {
                    invoiceWorkSheet = package.Workbook.Worksheets["All Functions"];
                }


                while (invoiceWorkSheet.Cells[rowCount, 1].Value != null)
                {
                    InvoiceEntity InvoiceRow = new InvoiceEntity();

                    InvoiceRow.FunctionArea = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 1].Value);
                    InvoiceRow.Client = Convert.ToInt32(invoiceWorkSheet.Cells[rowCount, 2].Value);
                    InvoiceRow.ClientName = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 3].Value);
                    InvoiceRow.Country = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 4].Value);
                    InvoiceRow.CountryName = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 5].Value);                    
                    InvoiceRow.MemberFirms = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 7].Value);
                    InvoiceRow.Industry = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 8].Value);
                    InvoiceRow.LCSP = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 9].Value);
                    InvoiceRow.Sector = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 10].Value);
                    InvoiceRow.WBSElement = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 11].Value);
                    InvoiceRow.Cluster = clusterMapper.Where(x => x.WBSElement == InvoiceRow.WBSElement).Count() >0 ? clusterMapper.First(x => x.WBSElement == InvoiceRow.WBSElement).cluster : string.Empty;//Convert.ToString(invoiceWorkSheet.Cells[rowCount, 6].Value);
                    InvoiceRow.PD = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 12].Value);
                    InvoiceRow.BillingManager = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 13].Value);
                    InvoiceRow.BillingPartner = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 14].Value);
                    InvoiceRow.ProjectController = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 15].Value);
                    InvoiceRow.ProjectManager = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 16].Value);
                    InvoiceRow.ProjectPartner = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 17].Value);
                    InvoiceRow.ServiceArea = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 18].Value);
                    InvoiceRow.ServiceLine = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 19].Value);
                    InvoiceRow.FiscalYear = Convert.ToInt32(Convert.ToString(invoiceWorkSheet.Cells[rowCount, 20].Value).Substring(10, 4));
                    InvoiceRow.Period = Convert.ToInt32(Convert.ToString(invoiceWorkSheet.Cells[rowCount, 20].Value).Substring(7, 2));
                    InvoiceRow.ServiceHrsR10YTD = Convert.ToDecimal(invoiceWorkSheet.Cells[rowCount, 21].Value);
                    InvoiceRow.NSRYTDR10 = Convert.ToDecimal(invoiceWorkSheet.Cells[rowCount, 22].Value);
                    InvoiceRow.FX = FXrates.Where(x => x.Period == InvoiceRow.Period && x.FiscalYear == InvoiceRow.FiscalYear).Select(x => x.FXRate).First();
                    InvoiceRow.AUDNSR = InvoiceRow.NSRYTDR10 / InvoiceRow.FX;
                    InvoiceRow.DiscRateYTDR10 = Convert.ToInt32(invoiceWorkSheet.Cells[rowCount, 23].Value);
                    InvoiceRow.NSRPerHrYTDR10 = Convert.ToDecimal(invoiceWorkSheet.Cells[rowCount, 24].Value);
                    InvoiceRow.MFUS = Convert.ToString(invoiceWorkSheet.Cells[rowCount, 25].Value);
                    //InvoiceRow.ServiceHrsR10AP = Convert.ToInt32(invoiceWorkSheet.Cells[rowCount, 28].Value);

                    invoices.Add(InvoiceRow);

                    rowCount++;
                }
            }

            repo.UpsertConsultingReport(invoices);
        }

        //GET api/Dashboard/GetConsultingReportData
        public List<string> GetConsultingReportData(string authToken)
        {
            List<string> result = new List<string>();

            if (AUTH_TOKENS.Contains(authToken))
            {
                DBRepository repo = new DBRepository();
                // Revenue By Cluster 
                List<Revenue> revByCluster = repo.GetRevenueByCluster(DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year));
                List<ChartData> clusterChartData = new List<ChartData>();
                clusterChartData = revByCluster.GroupBy(x => x.Cluster)
                              .Select(g => new ChartData
                              {
                                  seriesname = g.Key,
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.TotalRevenue.ToString()
                                  }).ToList()
                              }).ToList();
                List<LabelMini> clusterLabels = new List<LabelMini>();
                clusterLabels = revByCluster.GroupBy(x => x.Period).Select(g => new LabelMini { label = "P" + g.Key.ToString() }).ToList();

                //Revenue By Cost 
                List<Revenue> revAtCost = repo.GetRevenueAtCost();
                List<ValueMini> revByCostChartCurrentData = new List<ValueMini>();
                List<ValueMini> revByCostChartPreviousData = new List<ValueMini>();
                foreach (Revenue entity in revAtCost)
                {
                    if (entity.FiscalYear == (DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year)))
                    {
                        revByCostChartCurrentData.Add(new ValueMini() { value = entity.TotalRevenue.ToString() });
                    }
                    else
                    {
                        revByCostChartPreviousData.Add(new ValueMini() { value = entity.TotalRevenue.ToString() });
                    }
                }

                //Resource Hours Chart
                List<ResourceHours> resHours = repo.GetResourceHours();
                List<ChartData> resourceHoursData = new List<ChartData>();
                resourceHoursData = resHours.GroupBy(x => x.FiscalYear)
                              .Select(g => new ChartData
                              {
                                  seriesname = g.Key == (DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year)) ? "Current Year" : "Previous Year",
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.ServiceHours.ToString()
                                  }).ToList()
                              }).ToList();

                //Cumulative Hours Chart
                List<ResourceHours> cumulativeHours = repo.GetCumulativeHours(DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year));
                List<ChartData> cumulativeHoursData = new List<ChartData>();
                cumulativeHoursData = cumulativeHours.GroupBy(x => x.FiscalYear)
                              .Select(g => new ChartData
                              {
                                  seriesname = "YTD",
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.CumulativeHours.ToString()
                                  }).ToList()
                              }).ToList();
                List<LabelMini> cumulativeHrsLabels = new List<LabelMini>();
                cumulativeHrsLabels = cumulativeHours.GroupBy(x => x.Period).Select(g => new LabelMini { label = "P" + g.Key.ToString() }).ToList();

                //FX Trend Chart
                List<FXMaster> FXData = repo.GetFXRates();
                FXData.ForEach(x => x.FiscalYear = 1); // Workaround for the GroupBy
                List<ChartData> FXChartData = new List<ChartData>();
                FXChartData = FXData.GroupBy(x => x.FiscalYear)
                              .Select(g => new ChartData
                              {
                                  seriesname = "YTD",
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.FXRate.ToString()
                                  }).ToList()
                              }).ToList();
                List<LabelMini> FXChartLabels = new List<LabelMini>();
                FXChartLabels = FXData.Select(g => new LabelMini { label = "P" + g.Period.ToString() }).ToList();
                // Projects by Period Chart
                List<ConsultingChartEntity> projectData = new List<ConsultingChartEntity>();
                projectData.Add(new ConsultingChartEntity() { Month = "Jun", FiscalYear = 2015, Count = 13 });
                projectData.Add(new ConsultingChartEntity() { Month = "Jul", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Aug", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Sep", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Oct", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Nov", FiscalYear = 2015, Count = 9 });
                projectData.Add(new ConsultingChartEntity() { Month = "Dec", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Jan", FiscalYear = 2015, Count = 9 });
                projectData.Add(new ConsultingChartEntity() { Month = "Feb", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Mar", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "Apr", FiscalYear = 2015, Count = 10 });
                projectData.Add(new ConsultingChartEntity() { Month = "May", FiscalYear = 2015, Count = 10 });

                projectData.Add(new ConsultingChartEntity() { Month = "Jun", FiscalYear = 2016, Count = 7 });
                projectData.Add(new ConsultingChartEntity() { Month = "Jul", FiscalYear = 2016, Count = 6 });
                projectData.Add(new ConsultingChartEntity() { Month = "Aug", FiscalYear = 2016, Count = 5 });
                projectData.Add(new ConsultingChartEntity() { Month = "Sep", FiscalYear = 2016, Count = 6 });
                projectData.Add(new ConsultingChartEntity() { Month = "Oct", FiscalYear = 2016, Count = 13 });
                projectData.Add(new ConsultingChartEntity() { Month = "Nov", FiscalYear = 2016, Count = 18 });
                projectData.Add(new ConsultingChartEntity() { Month = "Dec", FiscalYear = 2016, Count = 22 });

                List<ChartData> projectChartData = new List<ChartData>();
                projectChartData = projectData.GroupBy(x => x.FiscalYear)
                              .Select(g => new ChartData
                              {
                                  seriesname = g.Key == (DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year)) ? "Current Year" : "Previous Year",
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.Count.ToString()
                                  }).ToList()
                              }).ToList();


                List<ConsultingChartEntity> resourceData = new List<ConsultingChartEntity>();
                resourceData.Add(new ConsultingChartEntity() { Month = "Jun", FiscalYear = 2015, Count = 53 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Jul", FiscalYear = 2015, Count = 50 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Aug", FiscalYear = 2015, Count = 30 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Sep", FiscalYear = 2015, Count = 54 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Oct", FiscalYear = 2015, Count = 31 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Nov", FiscalYear = 2015, Count = 54 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Dec", FiscalYear = 2015, Count = 26 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Jan", FiscalYear = 2015, Count = 33 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Feb", FiscalYear = 2015, Count = 52 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Mar", FiscalYear = 2015, Count = 66 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Apr", FiscalYear = 2015, Count = 76 });
                resourceData.Add(new ConsultingChartEntity() { Month = "May", FiscalYear = 2015, Count = 75 });

                resourceData.Add(new ConsultingChartEntity() { Month = "Jun", FiscalYear = 2016, Count = 84 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Jul", FiscalYear = 2016, Count = 113 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Aug", FiscalYear = 2016, Count = 115 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Sep", FiscalYear = 2016, Count = 136 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Oct", FiscalYear = 2016, Count = 178 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Nov", FiscalYear = 2016, Count = 203 });
                resourceData.Add(new ConsultingChartEntity() { Month = "Dec", FiscalYear = 2016, Count = 210 });

                List<ChartData> resourceChartData = new List<ChartData>();
                resourceChartData = resourceData.GroupBy(x => x.FiscalYear)
                              .Select(g => new ChartData
                              {
                                  seriesname = g.Key == (DateTime.Now.Month >= 4 ? DateTime.Now.Year + 1 : (DateTime.Now.Year)) ? "Current Year" : "Previous Year",
                                  data = g.Select(x => new ValueMini
                                  {
                                      value = x.Count.ToString()
                                  }).ToList()
                              }).ToList();

                result.Add(JsonConvert.SerializeObject(revByCostChartCurrentData));
                result.Add(JsonConvert.SerializeObject(revByCostChartPreviousData));
                result.Add(Convert.ToString(GetAverage(revByCostChartCurrentData)));
                result.Add(Convert.ToString(GetAverage(revByCostChartPreviousData)));
                result.Add(JsonConvert.SerializeObject(clusterChartData));
                result.Add(JsonConvert.SerializeObject(clusterLabels));
                result.Add(JsonConvert.SerializeObject(resourceHoursData));
                result.Add(Convert.ToString(GetAverage(resourceHoursData.First(x => x.seriesname == "Current Year").data)));
                result.Add(Convert.ToString(GetAverage(resourceHoursData.First(x => x.seriesname == "Previous Year").data)));
                result.Add(JsonConvert.SerializeObject(cumulativeHoursData));
                result.Add(JsonConvert.SerializeObject(cumulativeHrsLabels));
                result.Add(JsonConvert.SerializeObject(FXChartData));
                result.Add(JsonConvert.SerializeObject(FXChartLabels));
                result.Add(Convert.ToString(GetAverage(FXChartData.First(x => x.seriesname == "YTD").data)));
                result.Add(JsonConvert.SerializeObject(projectChartData));
                result.Add(Convert.ToString(GetAverage(projectChartData.First(x => x.seriesname == "Current Year").data)));
                result.Add(Convert.ToString(GetAverage(projectChartData.First(x => x.seriesname == "Previous Year").data)));
                result.Add(JsonConvert.SerializeObject(resourceChartData));
                result.Add(Convert.ToString(GetAverage(resourceChartData.First(x => x.seriesname == "Current Year").data)));
                result.Add(Convert.ToString(GetAverage(resourceChartData.First(x => x.seriesname == "Previous Year").data)));



            }

            return result;
        }

        private decimal GetAverage(List<ValueMini> DataCollection)
        {
            decimal sumValue = 0;

            foreach (ValueMini entity in DataCollection)
            {
                sumValue += Convert.ToDecimal(entity.value);
            }

            return sumValue / DataCollection.Count();
        }

        public System.Web.Mvc.FileResult GetConsultingReportPDF()
        {
            // create the HTML to PDF converter
            //HtmlToPdf htmlToPdfConverter = new HtmlToPdf();

            //// set a demo serial number
            //htmlToPdfConverter.SerialNumber = "YCgJMTAE-BiwJAhIB-EhlWTlBA-UEBRQFBA-U1FOUVJO-WVlZWQ==";
            //string url = "http://localhost:2083/Dashboard.html#/ConsultingExecDashboard";
            //byte[] pdfBuffer = htmlToPdfConverter.ConvertUrlToMemory(url);
            //System.Web.Mvc.FileResult fileResult = new System.Web.Mvc.FileContentResult(pdfBuffer, "application/pdf");
            //// send the PDF document to browser

            //fileResult.FileDownloadName = "HtmlToPdf.pdf";


            //return fileResult;
            return null;
        }



    }
}
