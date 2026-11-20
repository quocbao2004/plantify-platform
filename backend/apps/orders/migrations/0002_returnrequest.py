import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReturnRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('return_code', models.CharField(db_index=True, max_length=50, unique=True, verbose_name='Mã yêu cầu đổi trả')),
                ('request_type', models.CharField(choices=[('EXCHANGE', 'Đổi cây mới'), ('REFUND', 'Hoàn tiền'), ('CARE_SUPPORT', 'Hỗ trợ chăm sóc & phục hồi')], default='EXCHANGE', max_length=30, verbose_name='Hình thức mong muốn')),
                ('reason', models.CharField(choices=[('DAMAGED_TRANSIT', 'Gãy cành / Hư hỏng do vận chuyển'), ('WRONG_ITEM', 'Giao sai cây hoặc sai kích thước'), ('DISEASE_14D', 'Cây chết / ủ bệnh trong 14 ngày bảo hành'), ('NOT_AS_DESCRIBED', 'Cây khác xa so với mô tả / hình ảnh'), ('OTHER', 'Lý do khác')], default='DAMAGED_TRANSIT', max_length=50, verbose_name='Lý do đổi trả')),
                ('status', models.CharField(choices=[('PENDING', 'Chờ xét duyệt'), ('APPROVED', 'Đã duyệt - Đang xử lý'), ('REJECTED', 'Từ chối yêu cầu'), ('COMPLETED', 'Đã hoàn tất'), ('CANCELLED', 'Khách đã hủy')], db_index=True, default='PENDING', max_length=30, verbose_name='Trạng thái')),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Số lượng cây khiếu nại')),
                ('refund_amount', models.DecimalField(decimal_places=2, default=0, max_digits=14, verbose_name='Số tiền hoàn dự kiến')),
                ('customer_notes', models.TextField(blank=True, verbose_name='Mô tả chi tiết từ khách')),
                ('proof_images', models.JSONField(blank=True, default=list, verbose_name='Ảnh / Video bằng chứng cây hư hại')),
                ('admin_notes', models.TextField(blank=True, verbose_name='Ghi chú thẩm định từ Admin')),
                ('resolution_action', models.CharField(blank=True, max_length=50, verbose_name='Phương án giải quyết của Admin')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='return_requests', to='orders.purchaseorder', verbose_name='Đơn hàng gốc')),
                ('order_detail', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='return_requests', to='orders.purchaseorderdetail', verbose_name='Cây khiếu nại cụ thể')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='return_requests', to=settings.AUTH_USER_MODEL, verbose_name='Khách hàng')),
            ],
            options={
                'verbose_name': 'Yêu cầu đổi trả cây',
                'verbose_name_plural': 'Yêu cầu đổi trả cây',
                'db_table': 'return_requests',
                'ordering': ['-created_at'],
            },
        ),
    ]
