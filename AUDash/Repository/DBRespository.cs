using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using AUDash.Models;
using System.Configuration;
using System.Web.Configuration;
using System.IO;
using System.Data;
using System.Text;
namespace AUDash.Repository
{
    public class DBRepository
    {
        string connectionString;
        public DBRepository()
        {
            //Configuration rootWebConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("/");
            ConnectionStringSettings connString;

            ConnectionStringsSection connSection = (ConnectionStringsSection)WebConfigurationManager.GetSection("connectionStrings");

            if (connSection.ConnectionStrings.Count > 0)
            {
                connString = connSection.ConnectionStrings["AUDashboardAzureConnection"];
                if (connString != null)
                    connectionString = connString.ConnectionString;
                else
                    connectionString = string.Empty;
            }


        }

        private SqlConnection GetConnection()
        {
          
            //SqlConnection conn = new SqlConnection("Data Source=USHYDTUSHARMA4\\Sqlexpress;Initial Catalog=AUDashboard;Integrated Security = true");
            SqlConnection conn = new SqlConnection(connectionString);


            return conn;
        }

        public void AddResource(string resource)
        {
            SqlCommand cmd = new SqlCommand("Insert into resource(resourcedata) values('" + resource + "')", GetConnection());
            cmd.Connection.Open();
            cmd.ExecuteNonQuery();
            cmd.Connection.Close();
        }

        public List<Resource> GetAllResources()
        {
            List<Resource> resources = new List<Resource>();
            SqlCommand cmd = new SqlCommand("select resourceid, resourcedata from resource", GetConnection());
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                Resource resource = new Resource();
                resources.Add(new Resource()
                {
                    ResourceId = rdr.GetInt32(0),
                    ResourceData = rdr.GetString(1)
                });
            }

            cmd.Connection.Close();

            return resources;
        }

        internal void EditResource(string resource, int resourceId)
        {
            SqlCommand cmd = new SqlCommand("update resource set resourcedata = '" + resource + "' where resourceId = " + resourceId, GetConnection());
            cmd.Connection.Open();
            cmd.ExecuteNonQuery();
            cmd.Connection.Close();
        }

        internal string GetReferenceData(string storageId)
        {
            string storageData = string.Empty;
            SqlCommand cmd = new SqlCommand("select StorageData from ReferenceData where StorageId = '" + storageId + "'", GetConnection());
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                storageData = HttpUtility.HtmlDecode(rdr.GetString(0));
            }

            cmd.Connection.Close();

            return storageData;
        }


        internal void SetReferenceData(string storageId, string storageData)
        {
            SqlCommand cmd = new SqlCommand("update ReferenceData set StorageData = '" + HttpUtility.HtmlEncode(storageData) + "' where StorageId = '" + storageId + "'", GetConnection());
            cmd.Connection.Open();
            cmd.ExecuteNonQuery();
            cmd.Connection.Close();
        }


        internal Dictionary<string, string> GetDashboardCounts()
        {
            Dictionary<string, string> dashboardCounts = new Dictionary<string, string>();
            SqlCommand cmd = new SqlCommand("select * from ReferenceData where StorageId in ('Invoices','NewToDoItems','GSSResources','Projects')", GetConnection());
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                dashboardCounts.Add(rdr.GetString(0), HttpUtility.HtmlDecode(rdr.GetString(1)));
            }

            cmd.Connection.Close();

            return dashboardCounts;

        }

        public MemoryStream GetInvoiceFile(string varID)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (var varConnection = GetConnection())
            using (var sqlQuery = new SqlCommand(@"SELECT [File] FROM [InvoiceFiles] WHERE InvoiceNo = @varID", varConnection))
            {
                sqlQuery.Parameters.AddWithValue("@varID", varID);
                varConnection.Open();
                using (var sqlQueryResult = sqlQuery.ExecuteReader())
                    if (sqlQueryResult != null)
                    {
                        sqlQueryResult.Read();
                        var blob = new Byte[(sqlQueryResult.GetBytes(0, 0, null, 0, int.MaxValue))];
                        sqlQueryResult.GetBytes(0, 0, blob, 0, blob.Length);
                        //using (var fs = new MemoryStream(memoryStream, FileMode.Create, FileAccess.Write)) {
                        memoryStream.Write(blob, 0, blob.Length);
                        //}
                    }
                varConnection.Close();
            }
            return memoryStream;
        }

        public void InsertInvoiceFile(byte[] file, string fileName)
        {

            using (var varConnection = GetConnection())
                try
                {
                    using (var sqlWrite = new SqlCommand("INSERT INTO InvoiceFiles Values(@InvoiceNo, @File)", varConnection))
                    {
                        varConnection.Open();
                        sqlWrite.Parameters.Add("@InvoiceNo", SqlDbType.BigInt, 18).Value = fileName;
                        sqlWrite.Parameters.Add("@File", SqlDbType.VarBinary, file.Length).Value = file;
                        sqlWrite.ExecuteNonQuery();
                        varConnection.Close();
                    }
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("Violation of PRIMARY KEY constraint 'PK_InvoiceFiles'. Cannot insert duplicate key"))
                    {
                        using (var sqlWrite = new SqlCommand("UPDATE InvoiceFiles set [File] = @File where InvoiceNo = @InvoiceNo", varConnection))
                        {

                            sqlWrite.Parameters.Add("@InvoiceNo", SqlDbType.BigInt, 18).Value = fileName;
                            sqlWrite.Parameters.Add("@File", SqlDbType.VarBinary, file.Length).Value = file;
                            sqlWrite.ExecuteNonQuery();
                            varConnection.Close();
                        }

                    }
                    else
                        throw ex;
                }
        }


        public void UpsertConsultingReport(List<InvoiceEntity> invoices)
        {
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = GetConnection();

            cmd.Connection.Open();
            foreach (InvoiceEntity invoice in invoices)
            {
                StringBuilder commandText = new StringBuilder();
                commandText.Append("Insert into ConsultingReport values(");
                commandText.Append("'" + invoice.FunctionArea + "',");
                commandText.Append(invoice.Client + ",");
                commandText.Append("'" + invoice.ClientName + "',");
                commandText.Append("'" + invoice.Country + "',");
                commandText.Append("'" + invoice.CountryName + "',");
                commandText.Append("'" + invoice.Cluster + "',");
                commandText.Append("'" + invoice.MemberFirms + "',");
                commandText.Append("'" + invoice.Industry + "',");
                commandText.Append("'" + invoice.LCSP + "',");
                commandText.Append("'" + invoice.Sector + "',");
                commandText.Append("'" + invoice.WBSElement + "',");
                commandText.Append("'" + invoice.PD + "',");
                commandText.Append("'" + invoice.BillingManager + "',");
                commandText.Append("'" + invoice.BillingPartner + "',");
                commandText.Append("'" + invoice.ProjectController + "',");
                commandText.Append("'" + invoice.ProjectManager + "',");
                commandText.Append("'" + invoice.ProjectPartner + "',");
                commandText.Append("'" + invoice.ServiceArea + "',");
                commandText.Append("'" + invoice.ServiceLine + "',");
                commandText.Append(invoice.FiscalYear + ",");
                commandText.Append(invoice.Period + ",");
                commandText.Append(invoice.ServiceHrsR10YTD + ",");
                commandText.Append(invoice.NSRYTDR10 + ",");
                commandText.Append(invoice.FX + ",");
                commandText.Append(invoice.AUDNSR + ",");
                commandText.Append(invoice.DiscRateYTDR10 + ",");
                commandText.Append(invoice.NSRPerHrYTDR10 + ",");
                commandText.Append("'" + invoice.MFUS + "',");
                commandText.Append(invoice.ServiceHrsR10AP);
                commandText.Append(");");

                cmd.CommandText = commandText.ToString();
                cmd.ExecuteNonQuery();
            }
            cmd.Connection.Close();
        }

        public List<FXMaster> GetFXRates()
        {
            List<FXMaster> FXrates = new List<FXMaster>();
            SqlCommand cmd = new SqlCommand("select period, fiscalyear, fxrate from fxmaster order by 2,1", GetConnection());
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                FXrates.Add(new FXMaster()
                {
                    Period = rdr.GetInt32(0),
                    FiscalYear = rdr.GetInt32(1),
                    FXRate = rdr.GetDecimal(2)
                });
            }

            cmd.Connection.Close();

            return FXrates;
        }

        public List<Revenue> GetRevenueAtCost()
        {
            SqlCommand cmd = new SqlCommand("select fiscalyear, period, sum(AUDNSR) as RevenueAtCost from consultingreport group by FiscalYear, period order by 1,2", GetConnection());
            List<Revenue> revenueResult = new List<Revenue>();
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                revenueResult.Add(new Revenue()
                {
                    FiscalYear = rdr.GetInt32(0),
                    Period = rdr.GetInt32(1),
                    TotalRevenue = rdr.GetDecimal(2)
                });
            }

            cmd.Connection.Close();
            return revenueResult;
        }

        public List<Revenue> GetRevenueByCluster(int fiscalYear)
        {

            SqlCommand cmd = new SqlCommand("select cluster,period, SUM(AUDNSR) as RevenueByCluster from ConsultingReport where fiscalyear = " + fiscalYear + " group by cluster, period order by 1,2", GetConnection());
            List<Revenue> revenueResult = new List<Revenue>();
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                revenueResult.Add(new Revenue()
                {
                    Cluster = rdr.GetString(0),
                    Period = rdr.GetInt32(1),
                    TotalRevenue = rdr.GetDecimal(2)
                });
            }

            cmd.Connection.Close();
            return revenueResult;
        }

        public List<ResourceHours> GetResourceHours()
        {
            SqlCommand cmd = new SqlCommand("select fiscalyear, period, sum(ServiceHrsR10YTD) as ResourceHours from consultingreport group by FiscalYear, period order by 1,2", GetConnection());
            List<ResourceHours> resourceHoursResult = new List<ResourceHours>();
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                resourceHoursResult.Add(new ResourceHours()
                {
                    FiscalYear = rdr.GetInt32(0),
                    Period = rdr.GetInt32(1),
                    ServiceHours = rdr.GetDecimal(2)
                });
            }

            cmd.Connection.Close();
            return resourceHoursResult;
        }

        public List<ResourceHours> GetCumulativeHours(int fiscalYear)
        {
            SqlCommand cmd = new SqlCommand("select t1.fiscalyear, t1.period, t1.resourcehours, sum(t2.resourcehours) as cumulativehours from (select fiscalyear, period, sum(ServiceHrsR10YTD) as ResourceHours from consultingreport where fiscalyear=" + fiscalYear + " group by FiscalYear, period) t1 inner join (select fiscalyear, period, sum(ServiceHrsR10YTD) as ResourceHours from consultingreport where fiscalyear=" + fiscalYear + " group by FiscalYear, period) t2 on t1.period >= t2.period group by t1.fiscalyear, t1.period, t1.resourcehours order by 1,2", GetConnection());
            List<ResourceHours> resourceHoursResult = new List<ResourceHours>();
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                resourceHoursResult.Add(new ResourceHours()
                {
                    FiscalYear = rdr.GetInt32(0),
                    Period = rdr.GetInt32(1),
                    ServiceHours = rdr.GetDecimal(2),
                    CumulativeHours = rdr.GetDecimal(3)
                });
            }

            cmd.Connection.Close();
            return resourceHoursResult;

        }



        public List<ClusterWBSMapping> GetClusterMapping()
        {
            List<ClusterWBSMapping> ClusterMapper = new List<ClusterWBSMapping>();
            SqlCommand cmd = new SqlCommand("select cluster, wbselement from wbsclustermapping", GetConnection());
            cmd.Connection.Open();
            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                ClusterMapper.Add(new ClusterWBSMapping()
                {
                    cluster = rdr.GetString(0),
                    WBSElement = rdr.GetString(1)
                });
            }

            cmd.Connection.Close();

            return ClusterMapper;
        }
    }
}